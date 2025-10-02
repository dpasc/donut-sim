import React from "react";
import { Card } from "primereact/card";

/**
 * OrderCard component for displaying an order (active or completed).
 * Props:
 * - order: the order object
 * - donutCount: number of donuts to display
 * - isCompleted: boolean, true if order is completed
 * - onComplete: function to call when completing (only for active)
 * - timer: string or number to display as timer (active: seconds since, completed: seconds to complete)
 * - nodeRef: ref for animation (optional)
 */
const OrderCard = ({
  order,
  donutCount,
  isCompleted,
  onComplete,
  timer,
  nodeRef,
}) => {
  return (
    <div className="order-card-container" ref={nodeRef}>
      <Card
        className={isCompleted ? "p-mb-2" : ""}
        footer={
          isCompleted ? (
            <span>
              <i className="pi pi-check" style={{ marginRight: 4 }} />
              Completed: {timer}s
            </span>
          ) : null
        }
      >
        <div className="order-card-content">
          <div className="order-card-title">
            <span style={{ fontWeight: 600, marginBottom: 8 }}>{`Order #${order.id}`}</span>
          </div>
          <div className="order-card-donuts">
            <div className="donut-grid">
              {Array.from({ length: donutCount }).map((_, idx) => (
                <span key={idx} role="img" aria-label="donut">🍩</span>
              ))}
            </div>
          </div>
          {!isCompleted && (
            <div className="order-card-button">
              <button
                className="p-button p-component p-button-success"
                style={{ margin: "1rem auto 0 auto", display: "block" }}
                onClick={onComplete}
              >
                Complete
              </button>
            </div>
          )}
          <div className="order-card-timer">
            <i className="pi pi-clock" style={{ marginRight: 4 }} />
            {timer}s
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderCard;
