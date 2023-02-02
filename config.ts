const apiPath = {
  v1: "/api/v1",
};

const ports = {
  backendPort: 4000,
};

const getEnvironment = () => {
  switch (process.env.NEXT_PUBLIC_ENV_MODE) {
    case "production":
      return "production";
    case "development":
      return "development";
    default:
      return "local";
  }
};

const getLiveUrl = () => {
  switch (process.env.NEXT_PUBLIC_ENV_MODE) {
    case "production":
      return "https://app.helius.work";
    case "development":
      return "https://app.helius.work";
    default:
      return "http://localhost:3000";
  }
};

const getBaseUrl = () => {
  switch (process.env.NEXT_PUBLIC_ENV_MODE) {
    case "production":
      return `https://api.helius.work`;
    case "development":
      return `https://api.helius.work`;
    default:
      return `http://localhost:${ports.backendPort}`;
  }
};

const getSocketUrl = () => {
  switch (process.env.NEXT_PUBLIC_ENV_MODE) {
    case "production":
      return `https://api.helius.work`;
    case "development":
      return `https://api.helius.work`;
    default:
      return `ws://localhost:${ports.backendPort}`;
  }
};

const Url = {
  baseUrl: getBaseUrl(),
  liveUrl: getLiveUrl(),
  socketUrl: getSocketUrl(),
};

const appConfig = {
  BASE_URL: `${Url.baseUrl}${apiPath.v1}`,
  LIVE_URL: `${Url.liveUrl}`,
  SOCKET_URL: `${Url.socketUrl}`,
  environment: getEnvironment(),
  getBaseUrl: getBaseUrl(),
};

export default appConfig;
