// import './TreeCollapse.scss';
// import * as React from "react";
// import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
// import {ListGroup, ListGroupItem} from "reactstrap";
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import { TreeMapQuery_TreesBySelection_trees } from '../../api/queries/types/TreeMapQuery';




// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       width: '100%',
//     },
//     heading: {
//       fontSize: theme.typography.pxToRem(15),
//       fontWeight: theme.typography.fontWeightRegular,
//     },
//   }),
// );




// export const TreeCollapse: React.FunctionComponent = () => {
//     const classes = useStyles();
    
//     return (
//         <div>
//             <ExpansionPanel>
//                 <ExpansionPanelSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls="panel1a-content"
//                     id="panel1a-header"
//                  >
//                     <Typography className={classes.heading}>Tree id: {features.uri}</Typography>
//                 </ExpansionPanelSummary>
//                 <ExpansionPanelDetails>
//                     <ListGroup className = 'eachFeature'>
                      
                        
//                         {Object.keys(features).map(key =>{ 
//                           const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { e.preventDefault();}
//                           return (String((features as any)[key]).toLowerCase().indexOf("resource") === -1 ? <ListGroupItem> {key}: {(features as any)[key]} </ListGroupItem> :
//                           <ListGroupItem> {key}: <a href="" onClick = {onClick} id = {key}> {(features as any)[key]} </a> </ListGroupItem>)
                          
//                       })}
//                     </ListGroup>
//                 </ExpansionPanelDetails>
//             </ExpansionPanel>
//         </div>
//     );
// }

