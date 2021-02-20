import React from 'react';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import MailIcon from '@material-ui/icons/Mail';
import { Divider, ListItem, ListItemIcon } from '@material-ui/core'; 
import { Link, useLocation } from 'react-router-dom'; 
import { useLocalize } from '../../shared/contexts/localize';

export default function AppMenu() {

  const currentLocation = useLocation();
  const { strings } = useLocalize();
  const dynamicStrings = strings as any;

  const renderLink = (key: string, to: string, renderComponent: any) => {
    var selected = currentLocation.pathname === to;
    const text = dynamicStrings['menu.' + key];
    return (
      <ListItem title={text} selected={selected} button key={key} component={Link} to={to}>
        <ListItemIcon>{renderComponent()}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>);
  }

  return (

    <React.Fragment>

      <Divider />
      <List>
        {renderLink("engagaments", "/engagement/dashboard", () => <QuestionAnswerIcon />)}
        {renderLink("orgUnits", "/orgunit/tree", () => <AccountTreeIcon />)}
      </List>
      <Divider />
      <List>
        {renderLink("contact", "/contact", () => <MailIcon />)}
      </List>
    </React.Fragment>
  );
}
