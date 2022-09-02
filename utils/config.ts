export const getRedirectUrl = (path: string) => {
  switch (process.env.NODE_ENV) {
    case "production":
      return `http:/app.helius.work${path}`;
    case "development":
      return `http://localhost:3000${path}`;
    // return `https://app.0xblock.co${path}`;
    default:
      return `http://localhost:3000${path}`;
  }
};
