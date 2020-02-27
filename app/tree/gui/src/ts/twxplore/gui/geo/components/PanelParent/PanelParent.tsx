import * as React from "react";
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {TreesList} from "twxplore/gui/geo/components/trees/TreesList";
import {BoroughList} from "../BoroughList/BoroughList";
import {CityList} from "../CityList/CityList";
import SpeciesList from "../SpeciesList/SpeciesList";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrow: {
        right: '0px',
        marginBottom: '18px',
        cursor: 'pointer',
        '&:hover': {
            color: 'blue'
    }
  },
    arrow_disabled: {
        color: 'grey'
    }
}))

enum Mode{
    home = 'home',
    borough = 'borough',
    city = 'city',
    species = 'species'
}


export const PanelParent: React.FunctionComponent<{}> = () => {
    const classes = useStyles();

    const callSetMode = (newMode) => {
        setMode(newMode)
    }

    const backArrowClick = (e) => {
        setMode(Mode.home)
    }

    const [mode, setMode] = React.useState<string>(Mode.home)
    React.useEffect(() => {
         console.log(mode)
    });
    return (
        <div>
            <IconButton onClick = {backArrowClick} disabled = {mode === Mode.home}>
                <ArrowBackIcon className = {(mode === Mode.home ? classes.arrow_disabled : classes.arrow)} />
            </IconButton>
            { mode ===Mode.home && <TreesList callSetMode = {callSetMode}/>}
            { mode === Mode.borough && <BoroughList/>}
            { mode === Mode.city && <CityList/>}
            { mode ===  Mode.species && <SpeciesList/>}
        </div>
    );
}




