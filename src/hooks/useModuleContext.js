import ModuleContext from '../components/context';

export default () => {
  const { context } = React.useContext(ModuleContext);

  return context;
}