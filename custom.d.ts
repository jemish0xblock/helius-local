declare module "svg-inline-react";
declare module "react-rating";
declare module "universal-cookie";

declare global {
  namespace React {
    interface FunctionComponent {
      getInitialProps(): void;
    }
  }
}
