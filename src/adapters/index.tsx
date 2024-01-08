import { FC, ReactElement } from 'react';

type Props = {
  children: JSX.Element;
};

const Adapters: FC<Props> = ({ children }: { children: ReactElement }) => <>{children}</>;

export default Adapters;
