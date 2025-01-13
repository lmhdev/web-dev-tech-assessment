import { renderHook, act } from "@testing-library/react";
import { useError } from "./useError";

describe("useError", () => {
  test("initial error state is empty", () => {
    const { result } = renderHook(() => useError());

    expect(result.current.error).toBe("");
  });

  test("setError updates error state", () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.setError("Something went wrong");
    });

    expect(result.current.error).toBe("Something went wrong");
  });

  test("clearError resets error state", () => {
    const { result } = renderHook(() => useError());

    act(() => {
      result.current.setError("Something went wrong");
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe("");
  });
});
