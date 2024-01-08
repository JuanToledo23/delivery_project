import { render } from '@testing-library/react';
import MultipleAssignmentModal from './MultipleAssignmentModal';

describe('MultipleAssignmentModal', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <MultipleAssignmentModal
        selectedRows={[]}
        rows={[]}
        setSelectedRows={[]}
        open={true}
        onCancel={jest.fn()}
        onSuccess={jest.fn()}
        setModalState={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});