// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import type { GetProductsParams, ProductsPage } from "@marketplace/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCatalogData } from "./useCatalogData";

interface RecordedCall {
  params: GetProductsParams;
  signal: AbortSignal | undefined;
  resolve: (page: ProductsPage) => void;
  reject: (error: unknown) => void;
}

const recordedCalls: RecordedCall[] = [];

// Подменяем singleton mockApi: запросы не выполняются, а записываются
// в recordedCalls, чтобы тест сам решал, когда и чем резолвить.
vi.mock("@marketplace/shared", () => ({
  mockApi: {
    getProducts: (params: GetProductsParams, signal?: AbortSignal) =>
      new Promise<ProductsPage>((resolve, reject) => {
        recordedCalls.push({ params, signal, resolve, reject });
        signal?.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      }),
  },
}));

function makePage(total: number): ProductsPage {
  return {
    total,
    items: Array.from({ length: total }, (_, index) => ({
      id: `p-${index}`,
      title: `Товар ${index}`,
      price: 100,
      category: "Зерно",
      imageUrl: "",
    })),
  };
}

const PARAMS_A = { category: "Зерно", search: "", page: 1 };
const PARAMS_B = { category: "Дрип-пакеты", search: "", page: 1 };

describe("useCatalogData", () => {
  beforeEach(() => {
    recordedCalls.length = 0;
  });

  it("при быстрой смене параметров старый запрос отменяется и стейт получает данные только последнего", async () => {
    const { result, rerender } = renderHook(
      ({ params }) => useCatalogData(params),
      { initialProps: { params: PARAMS_A } },
    );

    expect(recordedCalls).toHaveLength(1);
    const firstCall = recordedCalls[0];
    expect(firstCall.params.category).toBe("Зерно");

    // Меняем параметры до завершения первого запроса.
    rerender({ params: PARAMS_B });

    expect(recordedCalls).toHaveLength(2);
    const secondCall = recordedCalls[1];

    // Старый запрос должен быть отменен.
    expect(firstCall.signal?.aborted).toBe(true);
    expect(secondCall.signal?.aborted).toBe(false);

    // Медленный ответ от устаревшего запроса приходит ПОСЛЕ быстрого нового.
    await act(async () => {
      secondCall.resolve(makePage(2));
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data?.total).toBe(2);
    expect(result.current.error).toBeNull();

    // Поздний resolve старого запроса не должен перезаписать стейт.
    await act(async () => {
      firstCall.resolve(makePage(12));
    });
    expect(result.current.data?.total).toBe(2);
  });

  it("отмененный запрос не переводит стейт в ошибку", async () => {
    const { result, rerender } = renderHook(
      ({ params }) => useCatalogData(params),
      { initialProps: { params: PARAMS_A } },
    );

    rerender({ params: PARAMS_B });

    // Завершаем новый запрос успешно.
    await act(async () => {
      recordedCalls[1].resolve(makePage(3));
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Аборт старого запроса уже произошел и не должен был засчитаться как ошибка.
    expect(result.current.error).toBeNull();
  });

  it("reject не-абортного запроса кладет ошибку в стейт, retry повторяет запрос", async () => {
    const { result } = renderHook(() => useCatalogData(PARAMS_A));

    await act(async () => {
      recordedCalls[0].reject(new Error("API Error: getProducts"));
    });
    await waitFor(() =>
      expect(result.current.error).toBe("API Error: getProducts"),
    );
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      result.current.retry();
    });
    expect(recordedCalls).toHaveLength(2);
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      recordedCalls[1].resolve(makePage(1));
    });
    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.data?.total).toBe(1);
  });
});
