CREATE TABLE password_change_requests (
  id varchar(40) PRIMARY KEY,
  expires timestamptz NOT NULL,
  user_name_number varchar(256) references users(name_number) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at timestamptz NOT NULL,
  modified_at timestamptz NOT NULL
);

CREATE TRIGGER password_change_requests_created_stamp BEFORE INSERT ON password_change_requests
FOR EACH ROW EXECUTE PROCEDURE created_stamp();

CREATE TRIGGER password_change_requests_modified_stamp BEFORE INSERT OR UPDATE ON password_change_requests
FOR EACH ROW EXECUTE PROCEDURE modified_stamp();
