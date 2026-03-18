import { mockVacationRequests, type VacationRequest } from "../mocks/data";

const STORAGE_KEY = "meddical:vacation-requests";
const EVENT_NAME = "meddical:vacation-requests-updated";

let memoryFallback: VacationRequest[] = cloneRequests(mockVacationRequests);

function cloneRequests(requests: VacationRequest[]): VacationRequest[] {
  return requests.map((request) => ({ ...request }));
}

function canUseBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function dispatchUpdate(requests: VacationRequest[]) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: { requests: cloneRequests(requests) },
    })
  );
}

function seedStorageIfNeeded(): void {
  if (!canUseBrowserStorage()) return;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryFallback));
}

export function getVacationRequestsSnapshot(): VacationRequest[] {
  if (!canUseBrowserStorage()) {
    return cloneRequests(memoryFallback);
  }

  seedStorageIfNeeded();

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return cloneRequests(memoryFallback);
  }

  try {
    const parsed = JSON.parse(stored) as VacationRequest[];
    if (!Array.isArray(parsed)) {
      return cloneRequests(memoryFallback);
    }

    memoryFallback = cloneRequests(parsed);
    return cloneRequests(parsed);
  } catch {
    return cloneRequests(memoryFallback);
  }
}

export function setVacationRequestsSnapshot(
  requests: VacationRequest[]
): VacationRequest[] {
  const next = cloneRequests(requests);
  memoryFallback = next;

  if (canUseBrowserStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  dispatchUpdate(next);
  return cloneRequests(next);
}

export function updateVacationRequestsSnapshot(
  updater: (requests: VacationRequest[]) => VacationRequest[]
): VacationRequest[] {
  const current = getVacationRequestsSnapshot();
  const next = updater(current);
  return setVacationRequestsSnapshot(next);
}

export function subscribeToVacationRequestsSnapshot(
  listener: (requests: VacationRequest[]) => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = () => {
    listener(getVacationRequestsSnapshot());
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      listener(getVacationRequestsSnapshot());
    }
  };

  window.addEventListener(EVENT_NAME, handleCustomEvent);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustomEvent);
    window.removeEventListener("storage", handleStorage);
  };
}

export function createVacationRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
