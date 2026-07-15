# System Design Interview Guide: Monolithic vs. Microservices Architecture

## 1. Monolithic Architecture
A monolithic architecture is an application built as a single, unified unit. 
*   **Definition:** All components (payments, login, notifications, search, user profile, etc.) share a single codebase, run on a single server, and are deployed at the exact same time.

### Drawbacks of Monolithic Architecture
1.  **Single Point of Failure (Cascading Failures):** If there is a bug in just one small module (like the payment code), the entire application can crash.
2.  **Inflexible Scaling:** You cannot scale individual parts based on demand. For example, during a Diwali flash sale where payment traffic is unusually high, you cannot scale just the payment servers independently; you are forced to scale the entire application.
3.  **Team Conflicts and Bottlenecks:** When many developers work on the same codebase, one team's bugs can block another team's completed work from being deployed.

---

## 2. Microservices Architecture
Microservices solve the problems of monoliths by breaking an application down into small, independent pieces.
*   **Definition:** Each service is responsible for only one specific business capability (e.g., User Service, Payment Service, Notification Service) and operates independently.
*   **Characteristics:** Each microservice has its own codebase, its own separate deployment process, its own independent database, and scales on its own.

### Real-World Microservices Examples:
*   **Targeted Scaling:** If an application sees a massive spike in users logging in, but very few are actually making payments, microservices allow you to increase the servers and databases *only* for the Login Service without wasting resources on the Payment Service.
*   **Swiggy / Food Delivery:** When an order is placed, the payment process, user notifications, the restaurant's dashboard, and the delivery partner's app all process their tasks simultaneously and in parallel without blocking one another.
*   **Amazon Flash Sales:** When millions of users are ordering simultaneously, microservices ensure that heavy traffic on the cart or landing pages does not bring down the payment systems.
*   **Netflix Regional Outages:** The architecture allows Netflix to completely fail or go down in one country while continuing to work perfectly fine in another country.

---

## 3. Core Microservice Concepts (Crucial Interview Topics)

### A. API Gateway
The API Gateway serves as the single entry point for all client requests.
*   **Key Responsibilities:**
    1.  **Authentication:** Checking if the user is logged in and has a valid auth token.
    2.  **Routing:** Directing requests to the correct server (e.g., sending search queries to the search server).
    3.  **Load Balancing:** Distributing traffic across multiple server instances.
    4.  **Rate Limiting (Real-World Metric):** If a single user maliciously or accidentally hits the server with **1,000 to 2,000 requests** at once, the gateway blocks them to prevent the system from crashing for other normal users.

### B. Service Discovery
Because microservices constantly scale up, shut down, or change IP addresses based on traffic, they need a dynamic way to find each other without hardcoded IPs.
*   **How it Works:** When a service starts, it registers its health and IP address in a central registry. When a service (like Order) needs to contact another (like Notification), it queries the registry for an available, healthy IP.
*   **Tools Used:** Netflix Eureka, HashiCorp Consul, Kubernetes DNS.

### C. Inter-Service Communication
1.  **Synchronous (REST, gRPC, GraphQL):** 
    *   **Usage:** Used when a service *must* wait for a response before moving to the next step. 
    *   **Example:** A user clicks "Pay Now." The Order Service calls the Payment Service and must wait for a "Success" or "Failure" response before confirming the order.
2.  **Asynchronous (Message Queues like Kafka, RabbitMQ):**
    *   **Usage:** Used when multiple systems need to react to an event, and the original service doesn't need to wait for their response.
    *   **Example:** An order is confirmed, and an "Order Placed" event is pushed to a Kafka queue. 
        *   The **Notification Service** reads it to send an email.
        *   The **Inventory Service** reads it to update stock levels.
        *   An **Analytics Service** passively reads it to update business dashboards behind the scenes.

### D. Handling Failures: Circuit Breaker Pattern
*   **The Problem (Cascading Failure Metric):** If the Payment Service goes down, the Order Service might keep sending requests. If **10,000 requests** pile up, each waiting for a **30-second timeout**, all server threads exhaust, and the Order Service crashes too.
*   **The Solution:** The Circuit Breaker pattern stops requests to a failing service and immediately returns a fallback response without waiting for timeouts.
*   **Three States:**
    1.  **Closed:** System is healthy, requests flow normally.
    2.  **Open:** Service is failing. Requests are immediately rejected (fast fail).
    3.  **Half-Open:** A few test requests are allowed through to check if the service has recovered.
*   **Tools:** Netflix Hystrix, Resilience4j.

### E. Database Management (One Database Per Service)
To maintain "loose coupling," every microservice must have its own private database, preventing teams from breaking each other's queries. 
*   **How to query across multiple services:**
    1.  **API Composition:** An aggregator service calls the necessary services (User, Order, Payment), collects the responses, joins the data, and returns it.
    2.  **CQRS (Command Query Responsibility Segregation):** Separates the read and write paths. A dedicated "read model" builds optimized, pre-joined views specifically for fast querying. 
    *   **Real-World Metric:** For complex dashboard queries, this read model might be scheduled to update every **1 hour or 5 hours** to keep the system highly optimized.

### F. Distributed Tracing
In a monolith, you debug by reading a single log file. In microservices, a single user request might jump across 8 different services, making debugging incredibly difficult.
*   **Solution:** Distributed Tracing assigns a unique **Trace ID** to every incoming request. This ID is passed along to every service the request touches, allowing you to stitch the logs together and see exactly where and when a failure occurred.
*   **Tools:** OpenTelemetry, Jaeger, Zipkin.

---

## 4. Disadvantages of Microservices (Crucial for Senior Interviews)
1.  **Operational Complexity:** You have to deploy, monitor, set up alerts, and maintain on-call teams for 10 to 15+ different services instead of just one.
2.  **Network Latency:** Instead of instant function calls, services communicate over HTTP/network calls, adding latency.
3.  **Distributed Transactions are Hard:** Rolling back database writes across different services when a multi-service operation fails halfway is highly complex.
4.  **Complex Debugging:** Without proper tools like OpenTelemetry, finding the root cause of an issue across services is very difficult.
5.  **Overkill for Small Teams:** Microservices are a bad choice for small teams (5-10 people) because engineers will spend too much time managing infrastructure instead of building the product. 
