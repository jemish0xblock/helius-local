import { Button, Result } from "antd";
import Link from "next/link";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const Error = ({ statusCode }: any) => {
  const { t } = useTranslation();
  return (
    <Result
      status={statusCode}
      title={statusCode}
      subTitle={t("errorScreen.errorMsg")}
      extra={
        <Link href="/account-security/login">
          <Button type="primary">{t("errorScreen.backToHome")}</Button>
        </Link>
      }
    />
  );
};

Error.getInitialProps = async ({ res, err }: any) => {
  let statusCode = null;
  if (res) {
    ({ statusCode } = res);
  } else if (err) {
    ({ statusCode } = err);
  }
  return {
    namespacesRequired: ["common"],
    statusCode,
  };
};

Error.defaultProps = {
  statusCode: null,
};

Error.propTypes = {
  statusCode: PropTypes.number,
};

export default Error;
