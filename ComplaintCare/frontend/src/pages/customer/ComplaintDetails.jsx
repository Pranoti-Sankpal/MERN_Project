import ComplaintDetailView from '../../components/ComplaintDetailView';

// Thin wrapper so routing stays consistent with the required page list;
// all logic lives in the shared ComplaintDetailView component.
export default function ComplaintDetails() {
  return <ComplaintDetailView />;
}
