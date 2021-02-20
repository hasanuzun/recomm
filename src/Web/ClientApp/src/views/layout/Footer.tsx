import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import {
  createStyles,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Theme,
  Typography
} from '@material-ui/core';
import {useLocalize} from '../../shared/contexts/localize';

export default function Footer() {

  const {language, setLanguage, strings} = useLocalize();

  const useStyles = makeStyles((theme : Theme) => createStyles({
    root: {
      flexGrow: 1,
      overflow:"hidden"
    },
    copyright: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      textAlign: 'left',
      color: theme.palette.text.secondary
    },
    locate: {
      padding: theme.spacing(2),
      textAlign: 'right',
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(1)
    },
    locateSelect: {
      fontSize: "12px"
    }
  }),);

  const classes = useStyles(); 

  const handleLanguageChange = (event : React.ChangeEvent < {
    value: unknown
  } >) => {
    var selectedLang = event.target.value as string;
    setLanguage(selectedLang);
  };

  return (

    <footer>
      <Drawer anchor="bottom" open variant="permanent">

        <div className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs className={classes.copyright}>

              <Typography align="center" color="textSecondary" variant="caption">
                {strings.footer.copyright} {new Date().getFullYear()} 
              </Typography>
            </Grid>

            <Grid item className={classes.locate}>
              <div>
                <Select
                  value={language}
                  autoWidth
                  onChange={handleLanguageChange}
                  className={classes.locateSelect}
                  inputProps={{
                  'aria-label': 'localizationSelect'
                }}>
                  <MenuItem value="tr">Türkçe</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="de">Deutsch</MenuItem>
                </Select>
              </div>
            </Grid>
          </Grid>

        </div>
      </Drawer>
    </footer>
  );
}
