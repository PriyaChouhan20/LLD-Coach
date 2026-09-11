export const SEED_PROBLEMS = [
  {
    id: 'prob_parking_lot_01',
    slug: 'parking-lot',
    title: 'Design a Multi-Level Parking Lot System',
    difficulty: 'MEDIUM',
    summary: 'Design an automated, multi-level parking lot management system supporting various vehicle types, dynamic slot allocation, entry/exit gates, and ticketing.',
    description: `A commercial parking structure needs a robust object-oriented software system to manage vehicle entries, parking spot allocations across multiple levels, automated ticketing, and checkout payment calculations.
The system must be extensible to support new spot assignment algorithms (e.g., nearest to entrance, optimal space utilization) and various payment methods without requiring changes to core parking controller logic.`,
    functionalRequirements: [
      'The parking lot has multiple floors/levels, and each floor contains multiple parking spots.',
      'Support multiple vehicle types: Motorcycle/Two-Wheeler (Compact/Small spot), Car/Sedan/SUV (Medium/Compact spot), Truck/Bus (Large spot), and Electric Vehicles (EV spot with charging station).',
      'Entry gates issue a time-stamped Parking Ticket with assigned spot location upon vehicle arrival.',
      'Exit gates compute parking fees based on duration and vehicle type, process payment, and mark the spot as available.',
      'Display boards at each floor entrance show real-time count of available spots for each vehicle type.',
      'Support pluggable parking spot allocation strategies (e.g., nearest available spot, floor-balanced).',
    ],
    nonFunctionalRequirements: [
      'Thread safety: Avoid race conditions when multiple gates attempt to assign the same parking spot simultaneously.',
      'Extensibility: Easy to introduce new vehicle types, special discount pricing rules, and new gate hardware without modifying core domain models.',
      'High Cohesion & Low Coupling: Separate spot management, fee calculation, and payment processing.',
    ],
    coreEntities: [
      'ParkingLot',
      'ParkingFloor',
      'ParkingSpot',
      'Vehicle',
      'ParkingTicket',
      'Gate / EntryPanel / ExitPanel',
      'ParkingFeeCalculator / Strategy',
      'Payment',
    ],
    sampleUseCases: [
      'Car arrives at Entry Gate 1 -> System allocates nearest compact spot on Level 1 -> Issues Ticket T-101 -> Spot is marked occupied.',
      'Display board on Level 1 updates available car spots from 5 to 4.',
      'Car presents Ticket T-101 at Exit Gate 2 -> System calculates fee for 2.5 hours ($15) -> Processes credit card payment -> Spot marked vacant.',
    ],
    evaluationRubric: {
      totalPoints: 100,
      passingScore: 60,
      criteria: [
        {
          category: 'SOLID_PRINCIPLES',
          name: 'Single Responsibility & Open/Closed',
          weight: 30,
          description: 'Separate fee calculation and spot assignment into extensible strategy interfaces.',
          guidelines: [
            'Avoid putting fee calculation or spot search logic directly inside the ParkingLot class.',
            'Use Strategy Pattern for PricingStrategy and SpotAssignmentStrategy.',
          ],
        },
        {
          category: 'CLASS_DESIGN',
          name: 'Domain Hierarchy & Abstraction',
          weight: 30,
          description: 'Clean inheritance or composition for Vehicles and ParkingSpots.',
          guidelines: [
            'ParkingSpot hierarchy or enum-based spot types with capacity checks.',
            'Encapsulate spot occupancy state transitions properly.',
          ],
        },
        {
          category: 'EXTENSIBILITY',
          name: 'Pattern Usage & Decoupling',
          weight: 20,
          description: 'Factory pattern for spot/vehicle creation and Observer pattern for display boards.',
          guidelines: [
            'DisplayBoard observing spot vacancy changes.',
            'Payment processor abstractions (Cash, Card, UPI).',
          ],
        },
        {
          category: 'EDGE_CASES',
          name: 'Concurrency & Assumptions',
          weight: 20,
          description: 'Concurrent gate entries, full lot handling, and lost ticket edge cases.',
          guidelines: [
            'Synchronized / atomic spot reservation during peak entry.',
            'Handling scenario when EV spot is occupied by standard car.',
          ],
        },
      ],
    },
    starterTemplate: {
      designExplanation: `### Architectural Overview
- Explain the overall design philosophy (e.g. modular controller, strategy-driven allocation).
- Mention design patterns used (e.g., Strategy Pattern for Spot Assignment and Fee Calculation, Observer Pattern for Floor Displays).`,
      classDesign: `### Core Interfaces & Classes
- **Enums**: \`VehicleType\`, \`ParkingSpotType\`, \`TicketStatus\`
- **Vehicle Hierarchy**: \`abstract class Vehicle\`, \`Car\`, \`Motorcycle\`, \`Truck\`
- **ParkingSpot Hierarchy**: \`abstract class ParkingSpot\`, \`CompactSpot\`, \`LargeSpot\`, \`ElectricSpot\`
- **Strategies**: \`interface SpotAssignmentStrategy\`, \`interface FeeCalculationStrategy\`
- **Managers / Controllers**: \`ParkingLot\`, \`ParkingFloor\`, \`EntryGate\`, \`ExitGate\``,
      codeSnippet: `// Define core classes and interfaces with methods
public interface SpotAssignmentStrategy {
    ParkingSpot findSpot(ParkingLot lot, Vehicle vehicle);
}

public abstract class Vehicle {
    private String licensePlate;
    private VehicleType type;
    // Constructor, getters
}

public class ParkingLot {
    private static ParkingLot instance;
    private List<ParkingFloor> floors;
    private SpotAssignmentStrategy allocationStrategy;
    
    public synchronized ParkingTicket parkVehicle(Vehicle vehicle) {
        // Implementation
    }
}`,
      tradeoffs: `### Concurrency & Edge Cases
1. **Concurrency**: How do you avoid double-booking when multiple entry gates assign spots concurrently? (e.g., Mutex lock per floor or AtomicReference).
2. **Extensibility**: How easy is it to add a dynamic surge-pricing model or VIP spots?
3. **Assumptions**: Single vs Multi-entry gates, pre-booking reservations.`,
    },
    tags: ['OOD', 'Strategy Pattern', 'Concurrency', 'State Management'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prob_vending_machine_02',
    slug: 'vending-machine',
    title: 'Design a State-Driven Vending Machine',
    difficulty: 'EASY',
    summary: 'Design an automated vending machine with item catalog, inventory control, coin/bill/card payment processing, and resilient state transitions.',
    description: `A smart vending machine requires an object-oriented controller to manage product selection, currency acceptance, change dispensation, and maintenance modes.
The system must prevent illegal state transitions (e.g., dispensing before sufficient money is inserted, changing selection after dispensing starts) and handle edge cases like sold-out items or exact change deficits.`,
    functionalRequirements: [
      'Maintain an inventory of items (e.g., Drinks, Snacks, Candies) located in indexed racks/slots with quantity and price.',
      'Accept multiple payment forms (Coins: 1, 5, 10, 25 cents; Bills: $1, $5; or Digital/Card payments).',
      'Allow user to select an item code, validate fund sufficiency, dispense item, and return precise change.',
      'Allow user to cancel transaction and receive full refund before item is dispensed.',
      'Support maintenance mode for operators to restock products and collect or refill cash reserves.',
      'Strict state flow: IdleState -> HasMoneyState -> DispensingState -> ReturnChangeState / SoldOutState.',
    ],
    nonFunctionalRequirements: [
      'State Pattern: Encapsulate behavior in discrete state objects to eliminate sprawling switch/if-else statements.',
      'Transaction Integrity: If dispensing physically fails or change cannot be made, rollback cash and notify user.',
      'Extensibility: Support new payment methods (e.g., NFC / Apple Pay) with minimal code changes.',
    ],
    coreEntities: [
      'VendingMachine',
      'State / VendingMachineState (Idle, HasMoney, Dispensing, SoldOut)',
      'Item / Product',
      'Inventory / Rack',
      'Coin / Note / Currency',
      'PaymentProcessor',
      'ChangeCalculator',
    ],
    sampleUseCases: [
      'User inserts $2.00 -> Machine transitions from Idle to HasMoney -> User selects Soda ($1.50) -> Machine dispenses Soda -> Returns $0.50 change -> Returns to Idle.',
      'User inserts $1.00 -> Selects Energy Drink ($2.50) -> Machine displays insufficient funds warning ($1.50 remaining).',
      'User presses Cancel button -> Machine refunds inserted money and resets to Idle.',
    ],
    evaluationRubric: {
      totalPoints: 100,
      passingScore: 60,
      criteria: [
        {
          category: 'SOLID_PRINCIPLES',
          name: 'State Pattern & Single Responsibility',
          weight: 35,
          description: 'Model machine behavior via State Pattern with clean interface methods.',
          guidelines: [
            'Create State interface (insertMoney, selectItem, dispense, cancelTransaction).',
            'Concrete states implement valid operations and throw or handle invalid operations gracefully.',
          ],
        },
        {
          category: 'CLASS_DESIGN',
          name: 'Inventory & Currency Modeling',
          weight: 25,
          description: 'Encapsulate inventory racks and currency stores safely.',
          guidelines: [
            'Prevent direct mutation of inventory without state validation.',
            'Support change calculation with greedy or dynamic coin dispenser.',
          ],
        },
        {
          category: 'EXTENSIBILITY',
          name: 'Pluggable Payments & Inventory',
          weight: 20,
          description: 'Clean abstraction for payment methods and hardware hooks.',
          guidelines: [
            'Payment abstraction to support both physical cash and digital readers.',
          ],
        },
        {
          category: 'EDGE_CASES',
          name: 'Refunds & Error Recovery',
          weight: 20,
          description: 'Exact change unavailable, item jammed during dispensing, cancellation.',
          guidelines: [
            'Ensure machine does not deduct inventory if physical dispensing encounters a jam.',
            'Handling concurrent button presses.',
          ],
        },
      ],
    },
    starterTemplate: {
      designExplanation: `### Architectural Overview
- Apply the **State Pattern** to represent discrete lifecycle phases of the Vending Machine.
- Detail how state transitions occur when user interactions happen.`,
      classDesign: `### Core Classes & Interfaces
- \`interface State\`: \`insertMoney()\`, \`selectItem()\`, \`dispenseItem()\`, \`cancelTransaction()\`
- Concrete States: \`IdleState\`, \`HasMoneyState\`, \`DispensingState\`, \`SoldOutState\`
- Domain Models: \`Item\`, \`Inventory\`, \`Coin\`, \`VendingMachine\``,
      codeSnippet: `public interface State {
    void insertCoin(VendingMachine machine, Coin coin);
    void selectItem(VendingMachine machine, String itemCode);
    void dispense(VendingMachine machine);
    void cancel(VendingMachine machine);
}

public class IdleState implements State {
    public void insertCoin(VendingMachine machine, Coin coin) {
        machine.addBalance(coin.getValue());
        machine.setState(machine.getHasMoneyState());
    }
    // other operations...
}`,
      tradeoffs: `### Concurrency & Edge Cases
1. **Change calculation shortfall**: What happens if the machine has insufficient small coins to dispense exact change?
2. **Mechanical Failure**: Atomic transaction handling if dispensing fails midway.`,
    },
    tags: ['OOD', 'State Pattern', 'Transactions', 'Finite State Machine'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prob_elevator_03',
    slug: 'elevator-system',
    title: 'Design a Multi-Elevator Dispatching System',
    difficulty: 'HARD',
    summary: 'Design a scalable elevator control system for a high-rise building with multiple elevators, internal/external call dispatching algorithms, and safety states.',
    description: `A high-rise commercial skyscraper with $N$ elevator shafts and $M$ floors requires a smart elevator management system.
The system receives external hall calls (floor number, UP/DOWN direction) and internal car requests (destination floor), and intelligently schedules elevator cars to minimize average wait time, avoid passenger starvation, and maximize energy efficiency.`,
    functionalRequirements: [
      'The building has $N$ elevator cars operating across $M$ floors.',
      'External Hall Request: Passengers press UP or DOWN buttons on any floor.',
      'Internal Car Request: Passengers press specific destination floor buttons inside a car.',
      'Elevator Controller assigns requests to the most optimal elevator car using a pluggable scheduling algorithm (e.g. SCAN / Elevator Algorithm, LOOK, FCFS, or Nearest Car).',
      'Elevator cars transition between states: IDLE, MOVING_UP, MOVING_DOWN, DOORS_OPEN, MAINTENANCE.',
      'Support emergency stop, overweight sensor alarms, and VIP/firefighter priority override modes.',
    ],
    nonFunctionalRequirements: [
      'Starvation Prevention: Ensure requests in the opposite direction are eventually served.',
      'Extensibility: Dispatching algorithm should be modular and easily replaceable.',
      'Real-time responsiveness and thread safety for concurrent floor requests.',
    ],
    coreEntities: [
      'ElevatorSystem / ElevatorController',
      'ElevatorCar',
      'Floor',
      'InternalButtonPanel / ExternalHallPanel',
      'Request / HallRequest / CarRequest',
      'ElevatorDispatchStrategy (SCAN / LOOK / Proximity)',
      'Door / WeightSensor / Display',
    ],
    sampleUseCases: [
      'Passenger on Floor 4 presses UP -> Controller evaluates 3 elevators -> Elevator 1 (at Floor 2 moving UP) is dispatched.',
      'Elevator 1 stops at Floor 4, opens door, passenger enters and presses Floor 9 -> Floor 9 added to Elevator 1 destination queue.',
      'Weight sensor triggers overweight warning (>1000kg) -> Doors stay open and alarm sounds until load is reduced.',
    ],
    evaluationRubric: {
      totalPoints: 100,
      passingScore: 60,
      criteria: [
        {
          category: 'SOLID_PRINCIPLES',
          name: 'Strategy & Dispatcher Decoupling',
          weight: 30,
          description: 'Decouple request dispatching logic from physical elevator car state.',
          guidelines: [
            'ElevatorController uses DispatchStrategy interface.',
            'ElevatorCar is solely responsible for its own motion, door states, and local floor queue.',
          ],
        },
        {
          category: 'CLASS_DESIGN',
          name: 'Queue & State Representation',
          weight: 30,
          description: 'Represent UP and DOWN request queues cleanly (e.g. Min/Max heaps or BitSets).',
          guidelines: [
            'Separate internal vs external request processing.',
            'Clean state transitions (IDLE -> MOVING -> STOPPED -> DOORS_OPEN).',
          ],
        },
        {
          category: 'EXTENSIBILITY',
          name: 'Extensibility & Algorithms',
          weight: 20,
          description: 'Ability to switch dispatching algorithms without refactoring ElevatorCar.',
          guidelines: [
            'Support SCAN (Elevator Algorithm), Shortest Seek Time First, or Zone-based dispatching.',
          ],
        },
        {
          category: 'EDGE_CASES',
          name: 'Edge Cases & Safety Modes',
          weight: 20,
          description: 'Emergency stops, door obstruction sensor, power outages, and peak hours.',
          guidelines: [
            'Handling car reversal at top and ground floors.',
            'Overweight and obstruction safety triggers.',
          ],
        },
      ],
    },
    starterTemplate: {
      designExplanation: `### Architectural Overview
- Centralized \`ElevatorController\` orchestrates requests across multiple \`ElevatorCar\` instances.
- Pluggable \`DispatchStrategy\` selects the optimal car for external hall requests.`,
      classDesign: `### Core Entities & Interfaces
- **Enums**: \`Direction\` (UP, DOWN, IDLE), \`ElevatorState\` (MOVING, STOPPED, MAINTENANCE)
- **Interfaces**: \`interface DispatchStrategy\` (\`selectElevator(List<ElevatorCar>, HallRequest)\`)
- **Classes**: \`ElevatorCar\`, \`ElevatorController\`, \`HallRequest\`, \`CarRequest\`, \`Door\``,
      codeSnippet: `public enum Direction { UP, DOWN, IDLE }

public class ElevatorCar {
    private int id;
    private int currentFloor;
    private Direction currentDirection;
    private TreeSet<Integer> upQueue;
    private TreeSet<Integer> downQueue;
    
    public void addDestination(int floor) {
        // Enqueue based on current direction
    }
    
    public void step() {
        // Move to next floor, open doors
    }
}`,
      tradeoffs: `### Concurrency & Algorithms
1. **Starvation Avoidance**: How SCAN / LOOK handles passengers requesting lower floors while the car is moving UP.
2. **Peak Traffic optimization**: Morning rush up vs Evening rush down strategies.`,
    },
    tags: ['OOD', 'Algorithms', 'Complex State', 'Dispatch Strategy', 'Concurrency'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prob_library_system_04',
    slug: 'library-management',
    title: 'Design an Automated Library Management System',
    difficulty: 'EASY',
    summary: 'Design an object-oriented library management system for book cataloging, member subscriptions, checkout loans, reservation queues, and fine calculations.',
    description: `A modern public library requires a comprehensive management system to track physical book copies across various categories, manage patron memberships, issue and return book items, handle hold/reservation queues, and calculate overdue fines automatically.`,
    functionalRequirements: [
      'Catalog Management: Search books by Title, Author, Subject, ISBN, or Publication Date.',
      'Book vs BookItem: A Book represents metadata; a BookItem represents a physical copy with a unique barcode and rack location.',
      'Member Management: Different member tiers (e.g. Student, Faculty, General) with maximum checkout limits and loan duration limits.',
      'Checkout & Return: Issue book items to members, generate transaction slips, and update item availability.',
      'Reservation / Hold: Members can place holds on checked-out books; holds are queued FIFO.',
      'Overdue Fine Calculation: Pluggable fine policy based on member type and overdue days count.',
      'Notifications: Send automated reminders when a reserved book is returned or a loan is nearing due date.',
    ],
    nonFunctionalRequirements: [
      'Clean separation between Catalog search, Lending policies, and Account management.',
      'Observer pattern for hold fulfillment and overdue notifications.',
      'Extensibility to add digital media / audiobooks or new fine calculation strategies.',
    ],
    coreEntities: [
      'Library',
      'Book / BookMetadata',
      'BookItem (Physical Copy with Barcode & Rack)',
      'Account / Member / Librarian',
      'BookLending / LoanTransaction',
      'BookReservation',
      'FineService / FineStrategy',
      'NotificationService / Observer',
    ],
    sampleUseCases: [
      'Member searches for "Design Patterns" -> System returns 3 available copies across Racks A1 and A2.',
      'Member borrows BookItem B-101 -> Loan created with 14-day due date -> Item status changed to LOANED.',
      'Member returns BookItem 5 days late -> FineCalculator assesses $5.00 fine -> Next member in reservation queue is notified.',
    ],
    evaluationRubric: {
      totalPoints: 100,
      passingScore: 60,
      criteria: [
        {
          category: 'SOLID_PRINCIPLES',
          name: 'Book vs BookItem Separation & SRP',
          weight: 30,
          description: 'Distinct separation between Book metadata (Title, Author) and physical BookItem copies (Barcode, Rack).',
          guidelines: [
            'Avoid duplicating title/author attributes inside individual physical copy instances.',
            'Member loan policies isolated from Book entities.',
          ],
        },
        {
          category: 'CLASS_DESIGN',
          name: 'Domain Models & Lending Transactions',
          weight: 30,
          description: 'Comprehensive modeling of BookLending, Reservation, and Account hierarchies.',
          guidelines: [
            'Lending transaction captures issuedDate, dueDate, returnDate, and fee.',
            'Reservation queue managed per Book or BookItem.',
          ],
        },
        {
          category: 'EXTENSIBILITY',
          name: 'Search & Notification Patterns',
          weight: 20,
          description: 'Search catalog abstraction and Observer notifications.',
          guidelines: [
            'Catalog search interface allowing keyword, regex, or indexed queries.',
            'Observer pattern for member alert dispatches.',
          ],
        },
        {
          category: 'EDGE_CASES',
          name: 'Lending Limits & Fine Edge Cases',
          weight: 20,
          description: 'Max borrowing limits reached, lost book handling, expired reservations.',
          guidelines: [
            'Prevent checkout if member has unpaid overdue fines exceeding threshold.',
            'Reservation cancellation when pickup window expires.',
          ],
        },
      ],
    },
    starterTemplate: {
      designExplanation: `### Architectural Overview
- Emphasize separation between **Book Metadata** and physical **BookItem copies**.
- Describe Catalog search architecture and Notification system.`,
      classDesign: `### Core Classes & Interfaces
- \`class Book\`: title, authors, ISBN, publicationDate
- \`class BookItem extends Book\`: barcode, isReferenceOnly, price, rackLocation, status
- \`class Member\`: id, name, activeLoans, totalFines
- \`class BookLending\`: creationDate, dueDate, returnDate, memberId, barcode
- \`interface FineCalculator\`: \`calculateFine(daysOverdue, memberType)\``,
      codeSnippet: `public class BookItem {
    private String barcode;
    private boolean isReferenceOnly;
    private Date borrowedDate;
    private Date dueDate;
    private double price;
    private BookStatus status;
    private Rack rack;
    
    public boolean checkout(String memberId) {
        if (this.isReferenceOnly || this.status != BookStatus.AVAILABLE) {
            return false;
        }
        this.status = BookStatus.LOANED;
        return true;
    }
}`,
      tradeoffs: `### Trade-offs & Assumptions
1. **Hold vs Checkout race conditions**: Ensuring a newly returned item is reserved exclusively for the next member in the FIFO queue for 48 hours.
2. **Reference-only materials**: Restriction enforcement at checkout.`,
    },
    tags: ['OOD', 'Catalog Search', 'Separation of Concerns', 'Observer Pattern'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
