import Edit from 'containers/EditProject/EditProject';
import Home from 'containers/Home/Home';
import EditPalowan from 'containers/Palowans/EditPalowan/EditPalowan';
import MainContainer from 'containers/MainContainer/MainContainer';
import PalowansContainer from 'containers/PalowansContainer/PalowansContainer';
import { ROUTES } from 'navigation/routes';
import { Routes, Route } from 'react-router-dom';
import PrivateRoutes from 'utils/PrivateRoutes';
import Login from 'containers/Login/Login';
import PrivateRoutes2 from 'utils/PrivateRoutes2';

const MainStack = () => {

  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.register} element={<MainContainer />} />
        <Route path={ROUTES.edit} element={<Edit />} />
        <Route element={<PrivateRoutes2 />}>
          <Route path={ROUTES.palowans} element={<PalowansContainer />} />
          <Route path={ROUTES.editPalowan} element={<EditPalowan />} />
        </Route>
      </Route>
      <Route path="*" element={<Login />} />
      <Route path='/' element={<Login />} />
    </Routes>
  );
};

export default MainStack;
