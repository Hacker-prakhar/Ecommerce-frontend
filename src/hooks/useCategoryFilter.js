import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { getAllCategoriesDashboard } from "../store/actions";

const useCategoryFilter = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    // Read values directly from the URL
    const currentPage = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1; // default to page 1 for users

    const pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : 10; // default to 10 if not set

    // Backend (Spring Boot Pageable) expects 0-based page index
    const zeroBasedPage = currentPage - 1;

    // Dispatch with numeric values
    dispatch(getAllCategoriesDashboard(zeroBasedPage, pageSize));
  }, [dispatch, searchParams]);
};

export default useCategoryFilter;

