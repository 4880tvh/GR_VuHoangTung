import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useEffect, useState, useMemo } from "react";
import { request } from "../api";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import PrimaryButton from "components/button/PrimaryButton";
import AddButton from "components/button/AddButton";
import { Modal, Box, Stack, Grid, Item } from "@mui/material";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
function CitizenScreen() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

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
  const [updateItem, setUpdateItem] = useState();
  const [deleteItem, setDeleteItem] = useState();
  const [citizen, setCitizen] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    dob: "",
    name: "",
    phone: null,
    age: null,
    address: "",
    email: "",
    nin: "",
  });
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    userId: null,
    name: "",
    phone: null,
    age: null,
    address: "",
    email: "",
    nin: "",
    dob: "",
  });
  const handleUpdate = (citizen) => {
    setUpdateFormData({
      userId: citizen.userId,
      name: citizen.name,
      phone: citizen.phone,
      age: citizen.age,
      address: citizen.address,
      email: citizen.email,
      nin: citizen.nin,
      dob: citizen.dob,
    });
    setUpdateModalOpen(true);
  };
  const handleAddFunction = () => {
    setModalOpen(true);
  };
  const handleExcelFunction = () => {
    request(
      "get",
      `/excel/download`,
      (res) => {
        console.log(res.data);
        const blob = new Blob([res.data]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "customer.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    ).then();
  };
  const handleExcelDownloadFunction = () => {
    request(
      "get",
      `/citizens/download-excel`,
      "success",
      "error",
      (res) => {
        console.log(res);
      }
    ).then();
  }

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleUpdateConfirm = () => {
    console.log("Dữ liệu Form Cập Nhật:", updateFormData);
    request(
      "put",
      `/citizens/update/${updateFormData.userId}`,
      "success",
      "error",
      updateFormData,
      (res) => {
        console.log(res);
        setCitizen(res.data);
      }
    ).then();
    handleCloseUpdateModal();
  };
  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
  };
  const handleConfirm = () => {
    console.log("Dữ liệu Form:", formData);
    request("post", "/citizens/create", "success", "error", formData, (res) => {
      console.log(res);
      setCitizen(res.data);
    }).then();

    handleCloseModal();
  };
  const handleDelete = (buildingId) => {
    request(
      "delete",
      `/citizens/delete/${buildingId}`,
      "success",
      "error",
      null,
      (res) => {
        console.log(res);
        setCitizen(res.data);
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
  useEffect(() => {
    console.log("call api");
    request("get", "/citizens/get-all", (res) => {
      console.log(res);
      setCitizen(res.data);
    }).then();
  }, [isModalOpen, isUpdateModalOpen, updateItem, deleteItem]); //
  const columns = useMemo(()=>[
    {
      title: "User Id",
      field: "userId",
    },
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Phone",
      field: "phone",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Delete",
      sorting: false,
      render: (rowData) => (
        <IconButton
          onClick={() => {
            handleDelete(rowData.userId);
            setDeleteItem(rowData.userId);
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
            setUpdateItem(rowData.userId);
          }}
          variant="contained"
          color="primary"
        >
          <EditTwoToneIcon />
        </IconButton>
      ),
    },
  ],[]);

  return (
    <div>
      <AddButton props={"Thêm mới cư dân"} onClick={handleAddFunction} />
      <a href=""></a>
      <AddButton props={"Xuất file Excel"} onClick={handleExcelFunction} />
      <AddButton props={"tải về File Excel"} onClick={handleExcelDownloadFunction} />
      <StandardTable
        title="Citizen List"
        columns={columns}
        data={citizen}
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
          <h2>Thêm Cư dân</h2>
          <Stack spacing={2}>
            <TextField
              label="Citizen Name"
              value={formData.name}
              onChange={handleInputChange("name")}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange("phone")}
              />

              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={handleInputChange("email")}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                defaultValue={0}
                value={formData.age}
                onChange={handleInputChange("age")}
              />
              <TextField
                fullWidth
                label="National Identity Number"
                value={formData.nin}
                onChange={handleInputChange("nin")}
              />
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of birth"
                value={dayjs(formData.dob)}
                onChange={(date) =>
                  setFormData({ ...formData, dob: date.format("YYYY-MM-DD") })
                }
              />
            </LocalizationProvider>
            <TextField
              label="Address"
              value={formData.address}
              onChange={handleInputChange("address")}
            />
            <PrimaryButton onClick={handleConfirm}>Xác Nhận</PrimaryButton>
          </Stack>
        </Box>
      </Modal>
      <Modal open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
        <Box sx={style}>
          <h2>Cập Nhật Toà Nhà</h2>
          <Stack spacing={2}>
            <TextField
              label="Citizen Name"
              value={updateFormData.name}
              onChange={handleUpdateInputChange("name")}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Phone Number"
                value={updateFormData.phone}
                onChange={handleUpdateInputChange("phone")}
              />

              <TextField
                fullWidth
                label="Email"
                value={updateFormData.email}
                onChange={handleUpdateInputChange("email")}
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                defaultValue={0}
                value={updateFormData.age}
                onChange={handleUpdateInputChange("age")}
              />
              <TextField
                fullWidth
                label="National Identity Number"
                value={updateFormData.nin}
                onChange={handleUpdateInputChange("nin")}
              />
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of birth"
                value={dayjs(updateFormData.dob)}
                onChange={(date) =>
                  setUpdateFormData({ ...formData, dob: date.format("YYYY-MM-DD") })
                }
              />
            </LocalizationProvider>
            <TextField
              label="Address"
              value={updateFormData.address}
              onChange={handleUpdateInputChange("address")}
            />
            <PrimaryButton onClick={handleUpdateConfirm}>Xác Nhận</PrimaryButton>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default CitizenScreen;
