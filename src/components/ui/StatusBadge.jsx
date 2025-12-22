import { Badge } from "./badge";

// const getStatusVariant = (status) => {
//   switch (status) {
//     case 'Rejected':
//       return 'destructive'; 
//     default:
//       return 'default';
//   }
// };

const getStatusStyle = (status) => {
  const baseStyle = 'rounded-full shadow-none font-medium px-3 uppercase text-[10px] tracking-wide';

  switch (status) {
    case 'Approved':
    case 'ManagerApproved':
    case 'FinanceApproved':
      return `${baseStyle} bg-green-100 text-green-700 border border-green-200`;

    case 'Rejected':
    case 'ManagerRejected':
    case 'FinanceRejected':
    case 'Closed':
    case 'Canceled':
      return `${baseStyle} bg-red-100 text-red-700 border border-red-200`;

    case 'Drafted':
    case 'ManagerSubmitted':
    case 'Submitted':
    case 'Pending':
      return `${baseStyle} bg-gray-200 text-gray-600 border border-gray-400`;

    case 'ManagerRevision':
    case 'Ongoing':
      return `${baseStyle} bg-orange-100 text-orange-600 border border-orange-200`;

    default:
      return baseStyle + ' bg-gray-100 text-gray-600';
  }
};


export default function StatusBadge({status}){
    return(
        <Badge
            variant='default'
            className={getStatusStyle(status)}
        >
            {status}
        </Badge>
    )
}