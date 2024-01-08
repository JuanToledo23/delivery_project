import Modal from "components/Modal/Modal";
import AssignmentForm from "components/AssignmentForm/AssignmentForm";
import "./MultipleAssignmentModal.css";
import { sortById, sortByName } from "utils/utils";
import { Paper } from "@mui/material";
import { dateFormat } from 'utils/utils';
import {
  getAllProfiles,
  getEngagement,
  getProjectTypes,
} from "adapters/Axios/services/project";
import {
  getAllProjects,
  getProperties,
} from "adapters/Axios/services/palowans";
import { useEffect, useState } from "react";
import Table from "components/Table/Table";
import {
  deleteProjectStaff,
  postProjectStaff,
} from "adapters/Axios/services/palowans";
import Loader from "components/Loader/Loader";

type MultipleAssignmentModalProps = {
  selectedRows: any[] | undefined;
  rows: any[] | undefined;
  setSelectedRows: any;
  open: boolean;
  onCancel: Function;
  onSuccess: Function;
  setModalState: any;
};

function MultipleAssignmentModal(props: MultipleAssignmentModalProps) {

  const { open, onCancel, selectedRows, setSelectedRows, rows, setModalState, onSuccess } = props;

  const editedColumns = [
    {
      title: "Nombre de Palowan",
      key: "palowan_name",
    },
    {
      title: "Rol de venta",
      key: "rol_sell",
    },
    {
      title: "Porcentaje de asignación",
      key: "bill_percentage",
    },
    {
      title: "Fecha de inicio",
      key: "StartDate",
      render: dateFormat,
    },
    {
      title: "Fecha de salida",
      key: "EndDate",
      render: dateFormat,
    },
    {
      title: "Número de proyecto",
      key: "project_name",
    },
    {
      title: "Tipo de proyecto",
      key: "project_type",
    },
    {
      title: "Responsable",
      key: "responsible_follow_up_name",
    },
    {
      title: "Nivel de venta",
      key: "sale_seniority_level",
    },
  ];

  const [engagementCatalog, setEngagementCatalog] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [typeProjectCatalog, settypeProjectCatalog] = useState<any[]>([]);
  const [profilesCatalog, setprofilesCatalog] = useState<any[]>([]);
  const [propertiesCatalog, setPropertiesCatalog] = useState<any[]>([]);
  const [isModalOpenTable, setIsModalOpenTable] = useState(false);
  const [newAssignments, setNewAssignments] = useState<any[]>([]);
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    setSelectedRows(newAssignments);
    toggleModals();
  };

  const toggleEditModalTable = () => {
    setIsModalOpenTable(!isModalOpenTable);
  };

  const toggleModals = () => {
    onCancel();
    toggleEditModalTable();
  };

  const saveChanges = () => {
    setLoading(true);
    const promises: Promise<any>[] = [];
    newAssignments.forEach((element) => {
      promises.push(deleteProjectStaff(element.id));
      promises.push(
        postProjectStaff({
          proyect_id: element.proyect_id,
          staff_id: element.staff_id,
          StartDate: element.StartDate,
          EndDate: element.EndDate,
          bill_percentage: element.bill_percentage,
          proyect_next_id: 1,
          rol_sell_id: element.rol_sell_id,
          notes_valuable: element.comment,
          responsible_follow_up: element.responsible_follow_up,
          Proyect_next: +element.Proyect_next,
          sale_seniority_level_id: element.sale_seniority_level_id,
          last_change: new Date().toISOString(),
          palowan_name: element.palowan_name,
          project_name: element.project_name,
          project_type: element.project_type,
          rol_sell: element.rol_sell,
          project_type_id: element.project_type_id,
          responsible_follow_up_name: element.responsible_follow_up_name,
          sale_seniority_level: element.sale_seniority_level,
        })
      );
    });
    Promise.all(promises).then(() => {
      setModalState(false);
      setIsModalOpenTable(false);
      onSuccess();
    }).finally(() => {
      setLoading(false);
    })
  };

  const onChangeAssignments = (assignment: any) => {
    assignment = {
      ...assignment,
      project_name: allProjects.find((x) => x.id === assignment.proyect_id)
        ?.label,
      project_type: typeProjectCatalog.find(
        (x) => x.id === assignment.project_type_id
      )?.name,
      rol_sell: profilesCatalog.find((x) => x.id === assignment.rol_sell_id)
        ?.name,
      responsible_follow_up_name: engagementCatalog.find(
        (x) => x.id === assignment.responsible_follow_up
      )?.name,
      sale_seniority_level: propertiesCatalog.find(
        (x) => x.id === assignment.sale_seniority_level_id
      )?.name,
      StartDate:
        typeof assignment.StartDate === "string"
          ? assignment.StartDate
          : assignment.StartDate.toISOString(),
      EndDate:
        typeof assignment.EndDate === "string"
          ? assignment.EndDate
          : assignment.EndDate.toISOString(),
    };
    let alreadyExists = false;
    const assignmentsList: any = newAssignments.map((item) => {
      if (item.id === assignment.id) {
        alreadyExists = true;
        return assignment;
      }
      return item;
    });
    if (!alreadyExists) {
      assignmentsList.push(assignment);
    }
    setNewAssignments(assignmentsList);
  };

  useEffect(() => {
    getAllProfiles().then((response: any) =>
      setprofilesCatalog(sortByName(response.data as any[]))
    );
    getProjectTypes().then((response: any) =>
      settypeProjectCatalog(sortByName(response.data as any[]))
    );
    getEngagement().then((response: any) =>
      setEngagementCatalog(sortByName(response.data as any[]))
    );
    getAllProjects().then((response: any) =>
      setAllProjects(sortByName(response.data as any[]))
    );
    getProperties().then((response: any) =>
      setPropertiesCatalog(sortByName(response.data as any[]))
    );
  }, []);

  useEffect(() => {
    setContinueButtonDisabled(true);
    if (selectedRows?.length === newAssignments.length) {
      setContinueButtonDisabled(!!newAssignments.find(assignment => !assignment.comment));
    }
  }, [newAssignments]);

  return (
    <div className="MultipleAssignmentModal" data-testid="MultipleAssignmentModal">
      <Modal
        open={open}
        onSave={toggleModals}
        onCancel={onCancel}
        fullScreen
        buttonSave="CONTINUAR"
        disableNextButton={continueButtonDisabled}
      >
        {selectedRows?.map((row, index) => (
          <div key={index} className="assignment-form-wrapper">
            <AssignmentForm value={row} onChange={onChangeAssignments} />
          </div>
        ))}
      </Modal>
      <Modal
        open={isModalOpenTable}
        onSave={saveChanges}
        onCancel={goBack}
        fullScreen
        buttonCancel="REGRESAR"
      >
        <Paper sx={{ mt: 3 }}>
          <Table
            columns={editedColumns}
            rows={sortById(newAssignments)}
            comparativeRows={sortById(rows)}
            placeholderCaption="No se han encontrado asignaciones aún"
            comparative
          />
        </Paper>
      </Modal>
      {loading && <Loader />}
    </div>
  );
}

export default MultipleAssignmentModal;
