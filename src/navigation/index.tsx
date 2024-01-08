import Header from 'components/Header/Header';
import ProjectDataContext from 'context/ProjectDataContext';
import { useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainStack from './MainStack/MainStack';

// interface Props {}

function Navigation() {
  const { showHeader } = useContext(ProjectDataContext);
  
  return (
    <BrowserRouter>
    {
      showHeader ? (<Header></Header>) : null
    }
    <Routes>
      <Route path="/*" element={<MainStack />} />
    </Routes>
  </BrowserRouter>
  )
}
// const Navigation: FC<Props> = () => (
//   <BrowserRouter>
//     {
//       showHeader ? (<Header></Header>) : null
//     }
//     <Routes>
//       <Route path="/*" element={<MainStack />} />
//     </Routes>
//   </BrowserRouter>
// );

export default Navigation;