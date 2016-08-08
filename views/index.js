const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');


module.exports = (app) => {
  app.set('view engine', 'handlebars');
  app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
      usersIndividualManageActionItem: (name, reason, voluntary) => {
        const action = voluntary ? `${name} opened their spot` : 'an admin opened the spot';
        const actionReason = voluntary ? '' : ` because <span style="font-weight: bold;">${reason}</span>`;
        const message = reason ? `${action} ${actionReason}` : 'No Current Action Item';

        return new Handlebars.SafeString(message);
      },
      spotsIsOpen: (id, open) => new Handlebars.SafeString(`Spot ${id} ${open ? 'is' : 'isn\'t'} open`)
    }
  }));
};
