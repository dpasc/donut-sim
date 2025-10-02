import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

/**
 * Generates a random DonutOrder object.
 */
function generateRandomOrder(lastIdRef) {
  const types = ["single", "double", "halfDozen", "fullDozen"];
  const id = lastIdRef.current + 1;
  lastIdRef.current = id;
  return {
    id,
    type: types[Math.floor(Math.random() * types.length)],
    timestamp: new Date().toISOString(),
    completionTime: null,
  };
}

/**
 * Returns a random interval (ms) with mean 5 minutes (300,000 ms).
 * Uses exponential distribution for sporadic timing.
 */
function getRandomIntervalMs() {
  const mean = 300000; // 5 minutes in ms
  return Math.round(-Math.log(1 - Math.random()) * mean);
}

const Layout = () => {
  const [orders, setOrders] = useState([]);
  const [now, setNow] = useState(Date.now());
  const lastIdRef = useRef(0);
  const timeoutRef = useRef(null);

  // Format time as HH:mm:ss
  const getFormattedTime = (timestamp) => {
    const date = new Date(timestamp);
    return date
      .toLocaleTimeString('en-AU', { hour12: false });
  };
  // Map of refs for each order card
  const orderRefs = useRef({});
  // Helper to get/create a ref for each order
  const getOrderRef = (id) => {
    if (!orderRefs.current[id]) {
      orderRefs.current[id] = React.createRef();
    }
    return orderRefs.current[id];
  };

  // Map order type to donut count
  const getDonutCount = (type) => {
    switch (type) {
      case "single":
        return 1;
      case "double":
        return 2;
      case "halfDozen":
        return 6;
      case "fullDozen":
        return 12;
      default:
        return 1;
    }
  };

  // Update 'now' every second for live counter
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to schedule the next order
  const scheduleNextOrder = () => {
    const interval = getRandomIntervalMs();
    timeoutRef.current = setTimeout(() => {
      setOrders((prev) => {
        const newOrder = generateRandomOrder(lastIdRef);
        return [newOrder, ...prev];
      });
      scheduleNextOrder();
    }, interval);
  };

  useEffect(() => {
    // Add an order immediately for testing/demo purposes
    setOrders(prev => {
      const newOrder = generateRandomOrder(lastIdRef);
      return [newOrder, ...prev];
    });
    // Start scheduling on mount
    scheduleNextOrder();
    return () => {
      // Cleanup on unmount
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-m-4">
      {/* Top-right time display */}
      <div className="app-time-topright">
        {getFormattedTime(now)}
      </div>
      <h2>Orders</h2>
      <div>
        {orders.filter(order => order.completionTime === null).length === 0 ? (
          <div className="p-col-12">
            <Card>
              <p>No active orders. Orders will appear here at random intervals.</p>
            </Card>
          </div>
        ) : (
          // Group orders into rows of 5
          (() => {
            const activeOrders = orders.filter(order => order.completionTime === null);
            const rows = [];
            for (let i = 0; i < activeOrders.length; i += 5) {
              rows.push(activeOrders.slice(i, i + 5));
            }
            return rows.map((row, rowIdx) => (
              <div className="order-row" key={rowIdx}>
                <TransitionGroup component={null}>
                  {row.map(order => {
                    const nodeRef = getOrderRef(order.id);
                    return (
                      <CSSTransition
                        key={order.id}
                        timeout={400}
                        classNames="order-card"
                        nodeRef={nodeRef}
                      >
                        <div className="order-card-container" ref={nodeRef}>
                          <Card>
                            <div className="order-card-content">
                              <div className="order-card-title">
                                <span style={{ fontWeight: 600, marginBottom: 8 }}>{`Order #${order.id}`}</span>
                              </div>
                              <div className="order-card-donuts">
                                <div className="donut-grid">
                                  {Array.from({ length: getDonutCount(order.type) }).map((_, idx) => (
                                    <span key={idx} role="img" aria-label="donut">🍩</span>
                                  ))}
                                </div>
                              </div>
                              <div className="order-card-button">
                                <button
                                  className="p-button p-component p-button-success"
                                  style={{ margin: "1rem auto 0 auto", display: "block" }}
                                  onClick={() => {
                                    setOrders(prev =>
                                      prev.map(o =>
                                        o.id === order.id
                                          ? { ...o, completionTime: new Date().toISOString() }
                                          : o
                                      )
                                    );
                                  }}
                                >
                                  Complete
                                </button>
                              </div>
                              <div className="order-card-timer">
                                <i className="pi pi-clock" style={{ marginRight: 4 }} />
                                {Math.floor((now - new Date(order.timestamp).getTime()) / 1000)}s
                              </div>
                            </div>
                          </Card>
                        </div>
                      </CSSTransition>
                    );
                  })}
                </TransitionGroup>
              </div>
            ));
          })()
        )}
      </div>
      {/* Completed Orders Log */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Completed Orders</h3>
        {orders.filter(order => order.completionTime !== null).length === 0 ? (
          <Card>
            <p>No completed orders yet.</p>
          </Card>
        ) : (
          // Group completed orders into rows of 5
          (() => {
            const completedOrders = orders
              .filter(order => order.completionTime !== null)
              .sort((a, b) => new Date(b.completionTime) - new Date(a.completionTime));
            const rows = [];
            for (let i = 0; i < completedOrders.length; i += 5) {
              rows.push(completedOrders.slice(i, i + 5));
            }
            return rows.map((row, rowIdx) => (
              <div className="order-row" key={rowIdx}>
                {row.map(order => (
                  <div className="order-card-container" key={order.id}>
                    <Card
                      className="p-mb-2"
                      footer={
                        <span>
                          <i className="pi pi-check" style={{ marginRight: 4 }} />
                          Completed: {Math.floor((new Date(order.completionTime) - new Date(order.timestamp)) / 1000)}s
                        </span>
                      }
                    >
                      <div className="order-card-content">
                        <div className="order-card-title">
                          <span style={{ fontWeight: 600, marginBottom: 8 }}>{`Order #${order.id}`}</span>
                        </div>
                        <div className="order-card-donuts">
                          <div className="donut-grid">
                            {Array.from({ length: getDonutCount(order.type) }).map((_, idx) => (
                              <span key={idx} role="img" aria-label="donut">🍩</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ));
          })()
        )}
      </div>
    </div>
  );
};

export default Layout;
