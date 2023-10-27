import { Leave } from "../types";

export type LeaveItemProps = Leave;

const LeaveItem = ({ id, reason, status, leaveDate }: LeaveItemProps) => {
  return <div>{reason}</div>;
};

export default LeaveItem;
