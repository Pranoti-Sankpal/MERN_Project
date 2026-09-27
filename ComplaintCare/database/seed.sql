-- ============================================================
-- ComplaintCare - Seed / Demo Data
-- All demo accounts use the password:  Password123
-- Hashes below are REAL bcrypt hashes (cost factor 12),
-- generated ahead of time - NOT plain text.
-- ============================================================

USE complaint_management;

-- ------------------------------------------------------------
-- Users: 1 Admin, 2 Employees, 5 Customers
-- ------------------------------------------------------------
INSERT INTO users (name, email, password, phone, role) VALUES
('System Admin', 'admin@complaintcare.com', '$2b$12$aj/rgou.Yh5u61WVfVVK..tvkYm/IqxIIOYnYGnnP.K7MSt2j5KwK', '9000000001', 'ADMIN'),
('Ravi Sharma', 'ravi.employee@complaintcare.com', '$2b$12$tfoy/xi6wQDBPdNzfFkxvO1Jjg1tmTg5kwAw3BAB3XGMmxFyWVMhS', '9000000002', 'EMPLOYEE'),
('Anita Desai', 'anita.employee@complaintcare.com', '$2b$12$YrEFEVCVes21w1l.sEiVYO/7o40ApEHTFDZa9Z64pMrCnQfiEMvGC', '9000000003', 'EMPLOYEE'),
('Rahul Verma', 'rahul.customer@example.com', '$2b$12$O8Tyt7PK16fn0HcRzxgY0ezSNseAzSBuTwOBrU0CSZu6fL9HePPUy', '9000000004', 'CUSTOMER'),
('Priya Nair', 'priya.customer@example.com', '$2b$12$BxG4pKHoXzXBBqNAuNe6CefodEmsSeEacaWHFfGG9BSO2am1WLicy', '9000000005', 'CUSTOMER'),
('Amit Joshi', 'amit.customer@example.com', '$2b$12$.yMP0HVeUhMH.lYJcn4XLOG18NVxK0Uff75LEOvfyc/nunAgCiCay', '9000000006', 'CUSTOMER'),
('Sneha Kulkarni', 'sneha.customer@example.com', '$2b$12$ERsIOC/yGtTQ/FNIM.gWQOVEe/NocVoo/uFGi/1sX3/XmXcyBdKia', '9000000007', 'CUSTOMER'),
('Vikram Singh', 'vikram.customer@example.com', '$2b$12$knil2o01w8NdjnNhsQ.zTecR5rItQyhc4uBy4FOCuWK.lPgA/O87C', '9000000008', 'CUSTOMER');

-- ------------------------------------------------------------
-- Complaint categories
-- ------------------------------------------------------------
INSERT INTO complaint_categories (name, description) VALUES
('Technical', 'Issues related to product/software technical faults'),
('Billing', 'Issues related to invoices, charges and payments'),
('Service', 'Issues related to service quality or delays'),
('Product', 'Issues related to physical product defects'),
('Account', 'Issues related to account access and settings'),
('Other', 'Any complaint that does not fit other categories');

-- ------------------------------------------------------------
-- Sample complaints (ids of users/categories are known from
-- the inserts above: admin=1, emp Ravi=2, emp Anita=3,
-- customers Rahul=4, Priya=5, Amit=6, Sneha=7, Vikram=8;
-- categories Technical=1, Billing=2, Service=3, Product=4,
-- Account=5, Other=6)
-- ------------------------------------------------------------

-- SUBMITTED (not yet reviewed by admin)
INSERT INTO complaints (customer_id, category_id, assigned_employee_id, subject, description, priority, status) VALUES
(4, NULL, NULL, 'Unable to access my account', 'I have been trying to log in since yesterday but keep getting an "invalid credentials" error even though my password is correct.', 'HIGH', 'SUBMITTED'),
(6, NULL, NULL, 'App crashes on checkout page', 'The mobile app crashes every time I try to complete a purchase from the checkout screen.', 'URGENT', 'SUBMITTED'),
(8, NULL, NULL, 'Request for refund status', 'I submitted a refund request two weeks ago and have not received any update.', 'MEDIUM', 'SUBMITTED');

-- ASSIGNED (categorized + employee assigned, work not started)
INSERT INTO complaints (customer_id, category_id, assigned_employee_id, subject, description, priority, status) VALUES
(5, 2, 2, 'Incorrect amount shown on invoice', 'My latest invoice shows a charge of 2,400 rupees but my plan only costs 1,200 rupees per month.', 'HIGH', 'ASSIGNED'),
(7, 5, 3, 'Cannot update phone number on profile', 'I am trying to update my registered mobile number but the settings page keeps showing a validation error.', 'LOW', 'ASSIGNED');

-- IN_PROGRESS (employee has started work)
INSERT INTO complaints (customer_id, category_id, assigned_employee_id, subject, description, priority, status) VALUES
(4, 4, 2, 'Product received damaged', 'The package arrived with a cracked casing and one of the accessories was missing from the box.', 'HIGH', 'IN_PROGRESS'),
(6, 3, 3, 'Service request is pending', 'I raised an installation request five days ago and no technician has been assigned yet.', 'MEDIUM', 'IN_PROGRESS');

-- RESOLVED (employee resolved, awaiting customer closure)
INSERT INTO complaints (customer_id, category_id, assigned_employee_id, subject, description, priority, status, resolution_remarks, resolved_at) VALUES
(5, 1, 2, 'Login OTP not received', 'I am not receiving the OTP on my registered email address while trying to log in.', 'MEDIUM', 'RESOLVED', 'Identified a delay in our email service provider queue. Issue has been fixed and OTP delivery verified as working.', NOW() - INTERVAL 1 DAY),
(8, 6, 3, 'General feedback on delivery time', 'Delivery took much longer than the estimated date shown at the time of order.', 'LOW', 'RESOLVED', 'Reviewed the logistics partner delay for this order and applied a service credit to the account. Delivery timelines have been corrected for the region.', NOW() - INTERVAL 2 DAY);

-- CLOSED (customer confirmed and closed)
INSERT INTO complaints (customer_id, category_id, assigned_employee_id, subject, description, priority, status, resolution_remarks, resolved_at, closed_at) VALUES
(7, 2, 2, 'Duplicate charge on card', 'I was charged twice for the same monthly subscription in the same billing cycle.', 'URGENT', 'CLOSED', 'Confirmed duplicate transaction from payment gateway logs and processed a full refund for the extra charge.', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 4 DAY);

-- ------------------------------------------------------------
-- Sample comments
-- ------------------------------------------------------------
INSERT INTO complaint_comments (complaint_id, user_id, comment) VALUES
(4, 5, 'Please check this on priority, it is affecting my monthly budget.'),
(4, 2, 'We are reviewing your billing cycle now, will update shortly.'),
(6, 4, 'Thank you for looking into this, please let me know the replacement timeline.'),
(6, 2, 'A replacement unit has been dispatched and should arrive within 3 business days.'),
(9, 5, 'Thanks for resolving this so quickly!');
