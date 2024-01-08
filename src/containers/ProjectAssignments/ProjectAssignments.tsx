import { useEffect, useState } from "react";
import "./ProjectAssignments.css";
import ProjectFilter from "../../components/ProjectFilter/ProjectFilter";
import Table from "components/Table/Table";
import { Button, Paper, Tooltip } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import {
  getProjectAssignments,
} from "adapters/Axios/services/project";
import Loader from "components/Loader/Loader";
import { dateFormat } from 'utils/utils';
import { ROUTES } from 'navigation/routes';
import MultipleAssignmentModal from "components/MultipleAssignmentModal/MultipleAssignmentModal";

function ProjectAssignments() {
  const [projectData, setProjectData] = useState<any>({});
  const [selectedRows, setSelectedRows] = useState<any[]>();
  const [isModalOpenPalowans, setIsModalOpenPalowans] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { id } = projectData;

  const columns = [
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
      title: "Ultima modificación",
      key: "last_change",
      render: (lastChange: string, row: any) => (
        <Tooltip
          className="tooltip flex-align-center"
          children={
            <div>
              <InfoIcon />
              {dateFormat(lastChange)}
            </div>
          }
          title={row.notes_valuable}
        />
      ),
    },
    {
      key: "staff_id",
      render: (staffId: string) => (
        <a rel="noreferrer" target="_blank" href={ROUTES.editPalowan.replace(':id', staffId)}>
          <Button 
            variant="text"
            children="DETALLE"
          />
        </a>
      ),
    }
  ];

  const toggleEditModalPalowans = () => {
    setIsModalOpenPalowans(!isModalOpenPalowans);
  };

  useEffect(() => {
    getTableData();
  }, [id]);

  const getTableData = () => {
    if (id) {
      setLoading(true);
      getProjectAssignments(id)
        .then((response: any) => {
          setRows(response.data);
        })
        .finally(() => setLoading(false));
    }
  }

  const isSelectionEmpty = !selectedRows || !selectedRows.length;

  return (
    <div className="ProjectAssignments" data-testid="ProjectAssignments">
      <h4 className="title">Asignación a Proyectos</h4>
      <span className="body1">
        Selecciona el país al que pertenece el proyecto.
      </span>
      <ProjectFilter onChange={setProjectData} firstLoader={false} />
      <div className="table-actions">
        <Button
          variant="contained"
          disabled={isSelectionEmpty}
          onClick={toggleEditModalPalowans}
        >
          EDITAR
          {!isSelectionEmpty && ` (${selectedRows.length})`}
        </Button>
      </div>
      <Paper sx={{ mt: 3 }}>
        <Table
          selectableRows
          onSelect={setSelectedRows}
          columns={columns}
          rows={rows}
          placeholderCaption="No se han encontrado asignaciones aún"
        />
      </Paper>
      <MultipleAssignmentModal
        open={isModalOpenPalowans}
        selectedRows={selectedRows}
        rows={rows}
        onSuccess={getTableData}
        setSelectedRows={setSelectedRows}
        onCancel={toggleEditModalPalowans}
        setModalState={setIsModalOpenPalowans}
      />
      {loading && <Loader />}
    </div>
  );
}

export default ProjectAssignments;
