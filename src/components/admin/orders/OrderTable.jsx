import { DataGrid } from '@mui/x-data-grid'
import { adminOrderTableColumn } from '../../helper/tableColumn';
import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Modal from '../../shared/Modal';
import UpdateOrderForm from './UpdateOrderForm';
import { FaBoxOpen } from 'react-icons/fa';
import { formatPrice } from '../../../utils/formatPrice';

const OrderTable = ({ adminOrder, pagination}) => {
  const [updateOpenModal, setUpdateOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
   const [viewOpenModal, setViewOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    pagination?.pageNumber + 1 || 1
  );

  const [searchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = useLocation().pathname;

const tableRecords = adminOrder?.map((item) => {
  return {
    ...item,
    id: item.orderId,
    email: item.email,
    totalAmount: item.totalAmount,
    status: item.orderStatus,
    date: item.orderDate || item.orderdate,
  }
});

const handlePaginationChange = (paginationModel) => {
  const page = paginationModel.page + 1;
  setCurrentPage(page);
  params.set("page", page.toString());
  navigate(`${pathname}?${params}`)
}

const handleEdit = (order) => {
  setSelectedItem(order);
  setUpdateOpenModal(true);
}
const handleView = (order) => {
    setSelectedItem(order);
    setViewOpenModal(true);
  };
  return (
    <div>
      <h1 className='text-slate-800 text-3xl text-center font-bold pb-6 uppercase'>
        All Orders
      </h1>

      <div>
         <DataGrid
         className='w-full'
            rows={tableRecords}
            columns={adminOrderTableColumn(handleEdit, handleView)}
            paginationMode='server'
            rowCount={pagination?.totalElements || 0}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pagination?.pageSize || 10,
                  page: currentPage - 1,
                },
              },
            }}
            onPaginationModelChange={handlePaginationChange}
            disableRowSelectionOnClick
            disableColumnResize
            pageSizeOptions={[pagination?.pageSize || 10]}
            pagination
            paginationOptions={{
              showFirstButton: true,
              showLastButton: true,
              hideNextButton: currentPage === pagination?.totalPages,
            }}
          />
      </div>

      <Modal
        open={updateOpenModal}
        setOpen={setUpdateOpenModal}
        title='Update Order Status'>
          <UpdateOrderForm
            setOpen={setUpdateOpenModal}
            open={updateOpenModal}
            loader={loader}
            setLoader={setLoader}
            selectedId={selectedItem.id}
            selectedItem={selectedItem}
            />
      </Modal>
          <Modal open={viewOpenModal} setOpen={setViewOpenModal} title="Order Details">
        {selectedItem && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 border p-4">
              <p><strong>Order ID:</strong> {selectedItem.id}</p>
              <p><strong>Email:</strong> {selectedItem.email}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              <p><strong>Order Date:</strong> {selectedItem.date}</p>
              <p><strong>Total:</strong> {formatPrice(selectedItem.totalAmount)}</p>
              <p><strong>Address ID:</strong> {selectedItem.addressId ?? "-"}</p>
            </div>

            <h2 className="text-lg font-semibold">
              Order Items ({selectedItem.orderItems?.length || 0})
            </h2>

            {(selectedItem.orderItems || []).map((item, idx) => (
              <div key={item.orderItemId || idx} className="border p-4 rounded-md">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{item.product?.productName}</p>
                    <p className="text-sm text-slate-500">Item #{idx + 1}</p>
                  </div>
                  <FaBoxOpen className="text-xl text-slate-400" />
                </div>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {formatPrice(item.finalPrice || item.orderedProductPrice)}</p>
                <p>Discount: {item.discount ? `${item.discount}%` : "-"}</p>
                <p>Product ID: {item.product?.productId}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default OrderTable