import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { useEffect, useState, useMemo } from "react";
import { request } from "../api";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import PrimaryButton from "components/button/PrimaryButton";
import AddButton from "components/button/AddButton";
import { Modal, Box, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
function BuildingScreen() {
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
  const [buildings, setBuildings] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    numFloors: null,
    location: "",
  });
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    buildingId: null,
    code: "",
    name: "",
    numFloors: null,
    location: "",
  });
  const handleUpdate = (building) => {
    setUpdateFormData({
      buildingId: building.buildingId,
      code: building.code,
      name: building.name,
      numFloors: building.numFloors,
      location: building.location,
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
      `/buildings/update/${updateFormData.buildingId}`,
      "success",
      "error",
      updateFormData,
      (res) => {
        console.log(res);
        setBuildings(res.data);
      }
    ).then();
    handleCloseUpdateModal();
  };
  const handleCloseUpdateModal = () => {
    setUpdateModalOpen(false);
  };
  const handleConfirm = () => {
    console.log("Dữ liệu Form:", formData);
    request("post", "/buildings/add", "success", "error", formData, (res) => {
      console.log(res);
      setBuildings(res.data);
    }).then();

    handleCloseModal();
  };
  const handleDelete = (buildingId) => {
    request(
      "delete",
      `/buildings/delete/${buildingId}`,
      "success",
      "error",
      null,
      (res) => {
        console.log(res);
        setBuildings(res.data);
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

    request("get", "/buildings/get-all", (res) => {

      setBuildings(res.data);
    }).then();
  }, [isModalOpen,isUpdateModalOpen,updateItem,deleteItem]); //
  const columns = useMemo(
    () => [
      {
        title: "STT",
        field: "buildingId",
      },
      {
        title: "Name",
        field: "name",
      },
      {
        title: "Code",
        field: "code",
      },
      {
        title: "Floors",
        field: "numFloors",
      },
      {
        title: "Location",
        field: "location",
      },
      {
        title: "Delete",
        sorting: false,
        render: (rowData) => (
          <IconButton
            onClick={() => {
              console.log(rowData);
              setDeleteItem(rowData.buildingId);
              handleDelete(rowData.buildingId);
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
              console.log(rowData);
              setUpdateItem(rowData.buildingId);
              handleUpdate(rowData);
            }}
            variant="contained"
            color="primary"
          >
            <EditTwoToneIcon />
          </IconButton>
        ),
      },
    ],
    [isModalOpen, isUpdateModalOpen, updateItem, deleteItem]
  );

  return (
    <div>
      <AddButton props={"Thêm tòa nhà"} onClick={handleAddFunction} />
      <StandardTable
        title="Bulding List"
        columns={columns}
        data={buildings}
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
          <h2>Thêm Toà Nhà</h2>
          <Stack spacing={2}>
            <TextField
              label="Mã tòa nhà"
              value={formData.code}
              onChange={handleInputChange("code")}
            />
            <TextField
              label="Tên"
              value={formData.name}
              onChange={handleInputChange("name")}
            />
            <TextField
              label="Số Tầng"
              value={formData.numFloors}
              onChange={handleInputChange("numFloors")}
            />
            <TextField
              label="Vị Trí"
              value={formData.location}
              onChange={handleInputChange("location")}
            />
            <PrimaryButton onClick={handleConfirm}>Xác Nhận</PrimaryButton>
          </Stack>
        </Box>
      </Modal>
      <Modal open={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
        <Box sx={style}>
          <h2>Cập Nhật Toà Nhà</h2>
          <Stack spacing={2}>
            <Box hidden>
              {" "}
              <TextField
                value={updateFormData.buildingId}
                onChange={handleUpdateInputChange("buildingId")}
              />
            </Box>

            <TextField
              label="Mã tòa nhà"
              value={updateFormData.code}
              onChange={handleUpdateInputChange("code")}
            />
            <TextField
              label="Tên"
              value={updateFormData.name}
              onChange={handleUpdateInputChange("name")}
            />
            <TextField
              label="Số Tầng"
              value={updateFormData.numFloors}
              onChange={handleUpdateInputChange("numFloors")}
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

export default BuildingScreen;
