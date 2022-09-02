const apiPath = {
  v1: "/api/v1",
};

const ports = {
  backendPort: 8000,
};

const getEnvironment = () => {
  switch (process.env.PROJECT_ENV) {
    case "production":
      return "production";
    case "development":
      return "development";
    default:
      return "local";
  }
};

const getLiveUrl = () => {
  switch (process.env.PROJECT_ENV) {
    case "production":
      return "https://app.helius.work";
    case "development":
      return "https://app.helius.work";
    default:
      return "http://localhost:3000";
  }
};

const getBaseUrl = () => {
  switch (process.env.PROJECT_ENV) {
    case "production":
      return `http://localhost:${ports.backendPort}`;
    case "development":
      return `http://localhost:${ports.backendPort}`;
    default:
      return `http://localhost:${ports.backendPort}`;
  }
};

const Url = {
  baseUrl: getBaseUrl(),
  liveUrl: getLiveUrl(),
};

const appConfig = {
  BASE_URL: `${Url.baseUrl}${apiPath.v1}`,
  LIVE_URL: `${Url.liveUrl}`,
  environment: getEnvironment(),
  getBaseUrl: getBaseUrl(),
};

export default appConfig;
