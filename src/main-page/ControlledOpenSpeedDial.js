// import * as React from 'react';
// import Box from '@mui/material/Box';
// import SpeedDial from '@mui/material/SpeedDial';
// import SpeedDialAction from '@mui/material/SpeedDialAction';
// import Draggable from 'react-draggable';
// import GestureIcon from '@mui/icons-material/Gesture';
// import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
// import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
// import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
// import PanToolAltRoundedIcon from '@mui/icons-material/PanToolAltRounded';
// import CameraAltIcon from '@mui/icons-material/CameraAlt';

// const actions = [
//   { icon: <GestureIcon />, name: 'Pencil' },
//   { icon: <SquareRoundedIcon />, name: 'Eraser' },
//   { icon: <UndoRoundedIcon />, name: 'Undo' },
//   { icon: <ClearRoundedIcon />, name: 'Clear' },
//   { icon: <CameraAltIcon />, name: 'Save' },  // New action for Screenshot
// ];


// export default function ControlledOpenSpeedDial({ OnAction }) {
//   const [open, setOpen] = React.useState(true);
//   const [direction, setDirection] = React.useState('right');

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   return (
//     <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
//       <Draggable>
//         <SpeedDial
//           ariaLabel="SpeedDial controlled open example"
//           sx={{ position: 'absolute', bottom: 16, right: 16 }}
//           icon={<PanToolAltRoundedIcon />}
//           onClose={handleClose}
//           onOpen={handleOpen}
//           direction={direction}
//           open={open}
//         >
//           {actions.map((action) => (
//             <SpeedDialAction
//               key={action.name}
//               icon={action.icon}
//               tooltipTitle={action.name}
//               onClick={() => {
//                 OnAction(action.name);
//                   setOpen(true);
//               }}
//             />
//           ))}
//         </SpeedDial>
//       </Draggable>
//     </Box>
//   );
// }
import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Draggable from 'react-draggable';
import GestureIcon from '@mui/icons-material/Gesture';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import PanToolAltRoundedIcon from '@mui/icons-material/PanToolAltRounded';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const actions = [
  { icon: <GestureIcon />, name: 'Pencil' },
  { icon: <SquareRoundedIcon />, name: 'Eraser' },
  { icon: <UndoRoundedIcon />, name: 'Undo' },
  { icon: <ClearRoundedIcon />, name: 'Clear' },
  { icon: <CameraAltIcon />, name: 'Save' },
];

export default function ControlledOpenSpeedDial({ OnAction }) {
  const [open, setOpen] = React.useState(true);
  const [direction, setDirection] = React.useState('right');
  const [currentIcon, setCurrentIcon] = React.useState(<PanToolAltRoundedIcon />); // 初始图标为移动图标

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleActionClick = (action) => {
    // 更新当前选中的图标
    const selectedAction = actions.find(item => item.name === action);
    setCurrentIcon(selectedAction.icon);
    
    // 执行动作
    OnAction(action);
    setOpen(true);
  };

  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <Draggable>
        <SpeedDial
          ariaLabel="SpeedDial controlled open example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={currentIcon}  // 更新图标为当前选中的图标
          onClose={handleClose}
          onOpen={handleOpen}
          direction={direction}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleActionClick(action.name)} // 处理点击事件
            />
          ))}
        </SpeedDial>
      </Draggable>
    </Box>
  );
}
