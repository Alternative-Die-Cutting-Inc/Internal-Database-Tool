import "./QuoteTool.scss";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageQuoteTool = () => {
  let query = useQuery();

  return (
    <>
      <div className="lol">{query.get("quoteNumber")}</div>
    </>
  );
};

export { PageQuoteTool };
