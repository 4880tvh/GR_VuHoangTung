import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useEffect, useState } from "react";
import { request } from "../api";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import PrimaryButton from "components/button/PrimaryButton";
import AddButton from "components/button/AddButton";
import { Modal, Box, Stack, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from 'dayjs';
import TextField from "@mui/material/TextField";
function ContractScreen() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [citizens, setCitizens] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [deleteItem,setDeleteItem] = useState(0);
  const [citiapartments, setCitiApartments] = useState([]);
  // const [apartments, setApartments] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: null,
    apartmentId: null,
    dayStart: Date(),
    dayEnd: Date(),
    cost: 0,
  });
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    id: "",
    name: "",
    floors: "",
    location: "",
  });
  const handleUpdate = (apartment) => {
    setUpdateFormData({
      id: apartment.id,
      name: apartment.name,
      floors: apartment.floors,
      location: apartment.location,
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
    request(
      "put",
      `/apartments/update/${updateFormData.id}`,
      "success",
      "error",
      updateFormData,
      (res) => {
        console.log(res);
        setCitiApartments(res.data);
      }
    ).then();
    handleCloseUpdateModal();
  };
  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
  };
  const handleConfirm = () => {
    console.log("Dữ liệu Form:", formData);
    request("post", "/citizenapartments/create", "success", "error", formData, (res) => {
      console.log(res);
      setCitiApartments(res.data);
    }).then();

    handleCloseModal();
  };
  const handleDelete = (citizenApartmentId) => {
    request(
      "delete",
      `/citizenapartments/delete/${citizenApartmentId}`,
      "success",
      "error",
      null,
      (res) => {
        console.log(res);
        setCitiApartments(res.data);
      }
    ).then();
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
  const convertDateTime = (inputDateTime) => {
    // Create a new Date object from the input string
    const date = new Date(inputDateTime);

    // Extract the date components using destructuring
    const { day, month, year } = {
        day: date.getDate().toString().padStart(2, '0'),
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        year: date.getFullYear()
    };

    // Assemble the formatted date string using template literals
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
}

  useEffect(() => {
    console.log("call api");
    request("get", "/citizenapartments/get-all", (res) => {
      setCitiApartments(res.data);
      console.log(citiapartments);
    }).then();
    request("get", "/citizens/get-all", (res) => {
      setCitizens(res.data);
      console.log(citizens);
    }).then();
    request("get", "/apartments/get-all", (res) => {
      setApartments(res.data);
      console.log(apartments);
    }).then();
  }, [isModalOpen,deleteItem]); //

  const columns = [
    {
      title: "Mã hợp đồng",
      field: "citizenApartmentId",
    },
    {
      title: "Mã cư dân",
      field: "userId",
    },
    {
      title: "Mã căn hộ",
      field: "apartmentId",
    },
    // {
    //   title: "ownerLevel",
    //   field: "ownerLevel",
    // },
    {
      title: "Bắt đầu",
      field: "dayStart",
      render: (rowData) =>{return (<Box>{convertDateTime(rowData.dayStart)}</Box>)},
    },
    {
      title: "Kết thúc",
      field: "dayEnd",
      render: (rowData) =>{return (<Box>{convertDateTime(rowData.dayEnd)}</Box>)},
    },
    {
      title: "Delete",
      sorting: false,
      render: (rowData) => (
        <IconButton
          onClick={() => {
            setDeleteItem(rowData.citizenApartmentId);
            console.log(deleteItem)
            handleDelete(rowData.citizenApartmentId);
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
          }}
          variant="contained"
          color="primary"
        >
          <EditTwoToneIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div>
      <AddButton props={'Thêm mới hợp đồng'} onClick={handleAddFunction} />
      <StandardTable
        title="Danh sách hợp đồng"
        columns={columns}
        data={citiapartments}
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
        <Box sx={style}>
          <h2>Tạo hợp đồng mới</h2>
          <Stack spacing={2}>
            <TextField
              select
              label="Tên cư dân"
              value={formData.userId}
              onChange={handleInputChange("userId")}
            >
              {citizens.map((item) => {
                return (
                  <MenuItem key={item.userId} value={item.userId}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              select
              label="Mã căn hộ"
              value={formData.apartmentId}
              onChange={handleInputChange("apartmentId")}
            >
              {apartments.map((item) => {
                return (
                  <MenuItem key={item.apartmentId} value={item.apartmentId}>
                    {item.code}
                  </MenuItem>
                );
              })}
            </TextField>

                          {/* DatePicker cho dayStart */}
            <Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>


              <DatePicker
                label="Ngày bắt đầu"
                value={dayjs(formData.dayStart)}
                onChange={(date) => setFormData({ ...formData, dayStart: date.format("YYYY-MM-DD") })}
              />
            </LocalizationProvider>
            </Stack>
           
            {/* DatePicker cho dayEnd */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày kết thúc"
                value={dayjs(formData.dayEnd)}
                onChange={(date) => setFormData({ ...formData, dayEnd: date.format("YYYY-MM-DD") })}
                
              />
            </LocalizationProvider>
            
            <TextField
              label="Giá tiền"
              value={formData.cost}
              onChange={handleInputChange("cost")}
            />
            <PrimaryButton onClick={handleConfirm}>Xác Nhận</PrimaryButton>
          </Stack>
        </Box>
      </Modal>
      <Modal open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
        <Box sx={style}>
          <h2>Thay đổi thông tin hợp đồng</h2>
          <Stack spacing={2}>
            <TextField
              label="Tên"
              value={updateFormData.name}
              onChange={handleUpdateInputChange("name")}
            />
            <TextField
              label="Số Tầng"
              value={updateFormData.floors}
              onChange={handleUpdateInputChange("floors")}
            />
            <TextField
              label="Vị Trí"
              value={updateFormData.location}
              onChange={handleUpdateInputChange("location")}
            />
            <PrimaryButton onClick={handleUpdateConfirm}>
              Xác Nhận
            </PrimaryButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default ContractScreen;
