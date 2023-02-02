export const getRedirectUrl = (path: any) => {
  switch (process.env.NEXT_PUBLIC_ENV_MODE) {
    case "production":
      return `http:/app.helius.work${path}`;
    case "development":
      return `https://app.0xblock.work${path}`;
    default:
      return `http://localhost:3000${path}`;
  }
};
