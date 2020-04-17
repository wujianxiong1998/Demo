import Vue from 'vue'
import {
  Button,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Input,
  Message,
  Table,
  TableColumn,
  Card,
  Tag
} from 'element-ui';

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Card)
Vue.use(Tag)

Vue.prototype.$message = Message