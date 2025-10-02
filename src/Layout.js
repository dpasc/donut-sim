import React, { useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import OrderCard from "./OrderCard";
import useNow from "./useNow";
import { groupIntoRows, getDonutCount, getFormattedTime } from "./utils";
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
  const [orders, setOrders] = React.useState([]);
  const lastIdRef = useRef(0);
  const timeoutRef = useRef(null);
  const now = useNow();

  // Map of refs for each order card (for animation)
  const orderRefs = useRef({});
  const getOrderRef = (id) => {
    if (!orderRefs.current[id]) {
      orderRefs.current[id] = React.createRef();
    }
    return orderRefs.current[id];
  };

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

  React.useEffect(() => {
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
          groupIntoRows(
            orders.filter(order => order.completionTime === null),
            5
          ).map((row, rowIdx) => (
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
                      <OrderCard
                        order={order}
                        donutCount={getDonutCount(order.type)}
                        isCompleted={false}
                        onComplete={() => {
                          setOrders(prev =>
                            prev.map(o =>
                              o.id === order.id
                                ? { ...o, completionTime: new Date().toISOString() }
                                : o
                            )
                          );
                        }}
                        timer={Math.floor((now - new Date(order.timestamp).getTime()) / 1000)}
                        nodeRef={nodeRef}
                      />
                    </CSSTransition>
                  );
                })}
              </TransitionGroup>
            </div>
          ))
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
          groupIntoRows(
            orders
              .filter(order => order.completionTime !== null)
              .sort((a, b) => new Date(b.completionTime) - new Date(a.completionTime)),
            5
          ).map((row, rowIdx) => (
            <div className="order-row" key={rowIdx}>
              {row.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  donutCount={getDonutCount(order.type)}
                  isCompleted={true}
                  timer={Math.floor((new Date(order.completionTime) - new Date(order.timestamp)) / 1000)}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Layout;
