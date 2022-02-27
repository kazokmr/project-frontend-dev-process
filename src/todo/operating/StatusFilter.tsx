const StatusFilter = ({ status }: { status: string }) => {
  return (
    <div>
      <h5>Filter by Status</h5>
      <ul>
        <li>
          <button type="button" aria-pressed={status === "all"}>
            All
          </button>
        </li>
        <li>
          <button type="button" aria-pressed={status === "active"}>
            Active
          </button>
        </li>
        <li>
          <button type="button" aria-pressed={status === "completed"}>
            Completed
          </button>
        </li>
      </ul>
    </div>
  );
};

export default StatusFilter;
