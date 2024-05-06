import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useEffect, useState, useMemo } from "react";
import { request } from "../api";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import PrimaryButton from "components/button/PrimaryButton";
import AddButton from "components/button/AddButton";
import { Modal,Box,Stack,MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
function ApartmentScreen() {
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [citizens, setCitizens] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [updateItem,setUpdateItem] = useState();
  const [deleteItem,setDeleteItem] = useState(0);
  const [apartments, setApartments] = useState([]);
  // const [apartments, setApartments] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    buildingId: null,
    code: "",
    description: "",
    isRented: false,
    isUsingService: false,
    name: "",
    price: null,
    state: 0,
  });
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
const [updateFormData, setUpdateFormData] = useState({
  apartmentId: null,
  buildingId: null,
    code: "",
    description: "",
    name: "",
    price: null,
});
const handleUpdate = (apartment) => {
  setUpdateFormData({
    apartmentId: apartment.apartmentId,
    buildingId: apartment.buildingId,
    code: apartment.code,
    description: apartment.description,
    name: apartment.name,
    price: apartment.price,
  });
  setUpdateModalOpen(true);
};
  const handleAddFunction = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleUpdateConfirm = () => {
    console.log("Dữ liệu Form Cập Nhật:", updateFormData);
    request("put", `/apartments/update/${updateFormData.apartmentId}`,"success","error",updateFormData, (res) => {
      console.log(res);
      setApartments(res.data);
    }).then();
    handleCloseUpdateModal();
  };
  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
  };
  const handleConfirm = () => {
    
    console.log("Dữ liệu Form:", formData);
    request("post", "/apartments/create","success","error",formData, (res) => {
      console.log(res);
      setApartments(res.data);
    }).then();
   
    handleCloseModal();
  };
  const handleDelete = (apartmentId) => {
    request("delete", `/apartments/delete/${apartmentId}`, "success", "error", null, (res) => {
      console.log(res);
      setApartments(res.data);
    }).then();
  };
  const handleUpdateInputChange = (field) => (event) => {
    setUpdateFormData({
      ...updateFormData,
      [field]: event.target.value,
    });
  };
  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };
  useEffect(() => {
    
    request("get", "/citizens/get-all", (res) => {
      setCitizens(res.data);
      
    }).then();
    request("get", "/apartments/get-all", (res) => {
      setApartments(res.data);
      
    }).then();
    request("get", "/buildings/get-all", (res) => {
      setBuildings(res.data);
      
    }).then();
  }, [isModalOpen, isUpdateModalOpen, updateItem, deleteItem]); //

  const columns = useMemo(() =>[
    {
      title: "apartmentId",
      field: "apartmentId",
    },
    {
      title: "name",
      field: "name",
    },
    {
      title: "state",
      field: "state",
      render: (state) =>{return (<Box>{state.state === 0 ? "Chưa thuê": "Đã cho thuê"}</Box>)},
    },
    {
      title: "Code",
      field: "code",
    },
    {
      title: "Description",
      field: "description",
    },
    {
      title: "IsRented",
      field: "isRented",
    },
    {
      title: "Delete",
      sorting: false,
      render: (rowData) => (
        <IconButton
        onClick={() => {
          handleDelete(rowData.apartmentId);
          setDeleteItem(rowData.apartmentId)
        }}
          variant="contained"
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      title: "Update",
      sorting: false,
      render: (rowData) => (
        <IconButton
          onClick={() => {
            handleUpdate(rowData);
            setUpdateItem(rowData.apartmentId)
          }}
          variant="contained"
          color="primary"
        >
          <EditTwoToneIcon />
        </IconButton>
      ),
    },
  ],[isModalOpen, isUpdateModalOpen, updateItem, deleteItem]);


 
  return (
    <div>
      <AddButton props={'Thêm mới căn hộ'} onClick={handleAddFunction} />
      <StandardTable
        title="Apartment List"
        columns={columns}
        data={apartments}
        // hideCommandBar
        //commandBarComponents={AddButton}
        options={{
          selection: false,
          pageSize: 20,
          search: true,
          sorting: true,
        }}
      />
      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={style} >
          <h2>Thêm Căn hộ</h2>
          <Stack spacing={2}><TextField
            label="Mã tòa nhà"
            value={formData.id}
            onChange={handleInputChange("code")}
          />
          <TextField
              select
              label="Thuộc tòa nhà"
              value={formData.buildingId}
              onChange={handleInputChange("buildingId")}
            >
              {buildings.map((item) => {
                return (
                  <MenuItem key={item.buildingId} value={item.buildingId}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </TextField>
          <TextField
            label="Tên"
            value={formData.name}
            onChange={handleInputChange("name")}
          />
          <TextField
            label="Giá thuê"
            value={formData.floors}
            onChange={handleInputChange("price")}
          />
          <TextField
            label="Mô tả"
            value={formData.location}
            onChange={handleInputChange("description")}
          />
          <PrimaryButton onClick={handleConfirm}>Xác Nhận</PrimaryButton></Stack>
          
        </Box>
      </Modal>
      <Modal open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
  <Box sx={style}>
    <h2>Cập Nhật Toà Nhà</h2>
    <Stack spacing={2}>
      <TextField
        label="Tên"
        value={updateFormData.name}
        onChange={handleUpdateInputChange("name")}
      />
      <TextField
              select
              label="Thuộc tòa nhà"
              value={updateFormData.buildingId}
              onChange={handleInputChange("buildingId")}
            >
              {buildings.map((item) => {
                return (
                  <MenuItem key={item.buildingId} value={item.buildingId}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </TextField>
      <TextField
        label="Mã căn hộ"
        value={updateFormData.code}
        onChange={handleUpdateInputChange("code")}
      />
      <TextField
        label="Giá thuê"
        value={updateFormData.price}
        onChange={handleUpdateInputChange("price")}
      />
      <TextField
        label="Vị Trí"
        value={updateFormData.description}
        onChange={handleUpdateInputChange("description")}
      />
      
      <PrimaryButton onClick={handleUpdateConfirm}>Xác Nhận</PrimaryButton>
    </Stack>
  </Box>
</Modal>
    </div>
  );
}

export default ApartmentScreen;
