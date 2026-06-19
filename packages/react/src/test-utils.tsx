import { act, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";

type ActEnvironment = typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
};

(globalThis as ActEnvironment).IS_REACT_ACT_ENVIRONMENT = true;

const mountedRoots: Array<{ container: HTMLElement; root: Root }> = [];

export function renderReact(element: ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(element);
  });

  mountedRoots.push({ container, root });

  return {
    container,
    getBySelector(selector: string) {
      const match = container.querySelector(selector);
      if (!(match instanceof HTMLElement)) {
        throw new Error(`Unable to find selector: ${selector}`);
      }
      return match;
    },
    getAllBySelector(selector: string) {
      return Array.from(container.querySelectorAll(selector)).filter(
        (node): node is HTMLElement => node instanceof HTMLElement,
      );
    },
  };
}

export function cleanupReact() {
  while (mountedRoots.length > 0) {
    const mounted = mountedRoots.pop();
    if (!mounted) {
      continue;
    }

    act(() => {
      mounted.root.unmount();
    });
    mounted.container.remove();
  }
}

export function clickElement(element: HTMLElement) {
  act(() => {
    element.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      }),
    );
  });
}
