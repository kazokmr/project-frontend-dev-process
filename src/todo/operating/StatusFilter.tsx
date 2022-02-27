const StatusFilter = ({ status }: { status: Array<string> }) => {
  return (
    <div>
      <h5>Filter by Status</h5>
      <ul>
        <li>
          <button
            type="button"
            aria-pressed={status.length === 0 || status.length >= 2}
          >
            All
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={status.length === 1 && status[0] === "active"}
          >
            Active
          </button>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={status.length === 1 && status[0] === "completed"}
          >
            Completed
          </button>
        </li>
      </ul>
    </div>
  );
};

export default StatusFilter;
