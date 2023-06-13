import "./DocketTool.scss";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageDocketTool = () => {
  let query = useQuery();

  return (
    <>
      <div className="lol">{query.get("docketNumber")}</div>
    </>
  );
};

export { PageDocketTool };
