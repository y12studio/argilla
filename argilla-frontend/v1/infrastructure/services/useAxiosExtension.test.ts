import { useAxiosExtension } from "./useAxiosExtension";

describe("useAxiosExtension", () => {
  const mockContext = {
    $axios: {
      create: jest.fn(() => ({
        onError: jest.fn(), // Mock onError method
        interceptors: {   // Mock interceptors
          request: {
            use: jest.fn()
          },
          response: {
            use: jest.fn()
          }
        }
      })),
    },
  } as any;

  it("should create an axios instance configured for public requests without Authorization header", () => {
    const create = useAxiosExtension(mockContext);
    const extendedAxios = create();
    const publicAxios = extendedAxios.makePublic();

    expect(mockContext.$axios.create).toHaveBeenCalledWith({
        withCredentials: false,
        headers: { Authorization: undefined },
    });
});
});