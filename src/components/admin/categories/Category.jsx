import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { FaFolderOpen, FaThList } from "react-icons/fa";
import toast from "react-hot-toast";

import Modal from "../../shared/Modal";
import AddCategoryForm from "./AddCategoryForm";
import Loader from "../../shared/Loader";
import { DeleteModal } from "../../../components/shared/DeleteModal";
import useCategoryFilter from "../../../hooks/useCategoryFilter";
import ErrorPage from "../../shared/ErrorPage";

import {
  deleteCategoryDashboardAction,
  getAllCategoriesDashboard,
} from "../../../store/actions";

import { categoryTableColumns } from "../../helper/tableColumn";

const Category = () => {
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const params = new URLSearchParams(searchParams);

  // -----------------------------
  // Modal states
  // -----------------------------
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // -----------------------------
  // Redux state
  // -----------------------------
  const { categoryLoader, errorMessage } = useSelector(
    (state) => state.errors
  );

  const { categories, pagination } = useSelector(
    (state) => state.products
  );

  // Backend pageNumber is 0-based
  // UI page is 1-based
  const [currentPage, setCurrentPage] = useState(
    pagination?.pageNumber != null
      ? pagination.pageNumber + 1
      : 1
  );

  // -----------------------------
  // Fetch categories
  // -----------------------------
  useCategoryFilter();

  // -----------------------------
  // Table records
  // -----------------------------
  const tableRecords =
    categories?.map((item) => ({
      id: item.categoryId,
      categoryName: item.categoryName,
    })) || [];

  // -----------------------------
  // Edit
  // -----------------------------
  const handleEdit = (category) => {
    setOpenUpdateModal(true);
    setSelectedCategory(category);
  };

  // -----------------------------
  // Delete
  // -----------------------------
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setOpenDeleteModal(true);
  };

  const onDeleteHandler = () => {
    dispatch(
      deleteCategoryDashboardAction(
        setOpenDeleteModal,
        selectedCategory?.id,
        toast
      )
    );
  };

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = pagination?.totalPages || 0;

  const pageSize = pagination?.pageSize || 10;

  // Backend pageNumber is 0-based
  const backendPageNumber =
    pagination?.pageNumber != null
      ? pagination.pageNumber
      : currentPage - 1;

  const isFirstPage = backendPageNumber === 0;

  const isLastPage =
    totalPages > 0 &&
    backendPageNumber === totalPages - 1;

  // -----------------------------
  // NEXT PAGE
  // -----------------------------
  const handleNextPage = () => {
    if (isLastPage) {
      return;
    }

    const nextPage = currentPage + 1;

    // URL uses 1-based page
    params.set("page", nextPage.toString());
    params.set("pageSize", pageSize.toString());

    navigate(`${pathname}?${params.toString()}`);

    // UI page
    setCurrentPage(nextPage);

    // Backend uses 0-based page
    dispatch(getAllCategoriesDashboard(nextPage - 1));
  };

  // -----------------------------
  // PREVIOUS PAGE
  // -----------------------------
  const handlePreviousPage = () => {
    if (isFirstPage) {
      return;
    }

    const previousPage = currentPage - 1;

    // URL uses 1-based page
    params.set("page", previousPage.toString());
    params.set("pageSize", pageSize.toString());

    navigate(`${pathname}?${params.toString()}`);

    // UI page
    setCurrentPage(previousPage);

    // Backend uses 0-based page
    dispatch(getAllCategoriesDashboard(previousPage - 1));
  };

  // -----------------------------
  // DataGrid pagination change
  // -----------------------------
  const handlePaginationChange = (paginationModel) => {
    const newPage = paginationModel.page;
    const newPageSize = paginationModel.pageSize;

    const oldPage = currentPage - 1;

    // Page size changed
    if (newPageSize !== pageSize) {
      params.set("page", "1");
      params.set("pageSize", newPageSize.toString());

      navigate(`${pathname}?${params.toString()}`);

      setCurrentPage(1);

      dispatch(getAllCategoriesDashboard(0));

      return;
    }

    // NEXT button clicked
    if (newPage > oldPage) {
      handleNextPage();
      return;
    }

    // PREVIOUS button clicked
    if (newPage < oldPage) {
      handlePreviousPage();
      return;
    }
  };

  // -----------------------------
  // Empty state
  // -----------------------------
  const emptyCategories =
    !categories || categories.length === 0;

  // -----------------------------
  // Error
  // -----------------------------
  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <div>
      {/* =========================
          ADD CATEGORY BUTTON
      ========================== */}
      <div className="pt-6 pb-10 flex justify-end">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300"
        >
          <FaThList className="text-xl" />
          Add Category
        </button>
      </div>

      {/* =========================
          TITLE
      ========================== */}
      {!emptyCategories && (
        <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
          All Categories
        </h1>
      )}

      {/* =========================
          LOADER
      ========================== */}
      {categoryLoader ? (
        <Loader />
      ) : (
        <>
          {/* =========================
              EMPTY STATE
          ========================== */}
          {emptyCategories ? (
            <div className="flex flex-col items-center justify-center text-gray-600 py-10">
              <FaFolderOpen
                size={50}
                className="mb-3"
              />

              <h2 className="text-2xl font-semibold">
                No Categories Created Yet
              </h2>
            </div>
          ) : (
            /* =========================
               DATA GRID
            ========================== */
            <div className="max-w-fit mx-auto">
              <DataGrid
                className="w-full"

                rows={tableRecords}

                columns={categoryTableColumns(
                  handleEdit,
                  handleDelete
                )}

                /* Server-side pagination */
                paginationMode="server"

                /* Total number of records */
                rowCount={
                  pagination?.totalElements || 0
                }

                /* Controlled pagination */
                paginationModel={{
                  page: currentPage - 1,
                  pageSize: pageSize,
                }}

                onPaginationModelChange={
                  handlePaginationChange
                }

                disableRowSelectionOnClick
                disableColumnResize

                pageSizeOptions={[pageSize]}

                pagination

                /* Pagination buttons */
                slotProps={{
                  pagination: {
                    showFirstButton: true,
                    showLastButton: true,

                    /*
                     * MUI's pagination component receives
                     * these options.
                     *
                     * Hide Next when last page.
                     * Hide Previous when first page.
                     */
                    hideNextButton: isLastPage,
                    hidePrevButton: isFirstPage,
                  },
                }}
              />
            </div>
          )}
        </>
      )}

      {/* =========================
          ADD / UPDATE MODAL
      ========================== */}
      <Modal
        open={
          openUpdateModal || openModal
        }
        setOpen={
          openUpdateModal
            ? setOpenUpdateModal
            : setOpenModal
        }
        title={
          openUpdateModal
            ? "Update Category"
            : "Add Category"
        }
      >
        <AddCategoryForm
          setOpen={
            openUpdateModal
              ? setOpenUpdateModal
              : setOpenModal
          }
          open={categoryLoader}
          category={selectedCategory}
          update={openUpdateModal}
        />
      </Modal>

      {/* =========================
          DELETE MODAL
      ========================== */}
      <DeleteModal
        open={openDeleteModal}
        loader={categoryLoader}
        setOpen={setOpenDeleteModal}
        title="Are you want to delete this category"
        onDeleteHandler={onDeleteHandler}
      />
    </div>
  );
};

export default Category;