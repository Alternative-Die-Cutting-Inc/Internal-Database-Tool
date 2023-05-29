<?php




class BackendHelper {
    private $db;

    function __construct($host, $username, $password, $db_name) {
        $this->db = new mysqli($host, $username, $password, $db_name);

        if ($this->db->connect_error) {
            die("Connection failed: " . $this->db->connect_error);
        }
    }

    function close() {
        $this->db->close();
    }

    function sanitize($data) {
        return $this->db->real_escape_string($data);
    }

    function insert($table_name, $data) {
        $columns = implode(", ", array_keys($data));
        $values = "'" . implode("', '", array_map(array($this, 'sanitize'), array_values($data))) . "'";
        $query = "INSERT INTO $table_name ($columns) VALUES ($values)";

        if ($this->db->query($query) === TRUE) {
            return true;
        } else {
            echo "Error: " . $query . "<br>" . $this->db->error;
            return false;
        }
    }

    function selectAll($table_name) {
        $query = "SELECT * FROM $table_name";
        $result = $this->db->query($query);

        if ($result->num_rows > 0) {
            $rows = array();
            while($row = $result->fetch_assoc()) {
                array_push($rows, $row);
            }
            return $rows;
        } else {
            echo "No results found.";
            return false;
        }
    }

    function select($table_name, $condition) {
        $query = "SELECT * FROM $table_name WHERE $condition";
        $result = $this->db->query($query);

        if ($result->num_rows > 0) {
            $rows = array();
            while($row = $result->fetch_assoc()) {
                array_push($rows, $row);
            }
            return $rows;
        } else {
            echo "No results found.";
            return false;
        }
    }

    function update($table_name, $data, $condition) {
        $set_values = "";
        foreach ($data as $key => $value) {
            $set_values .= "$key = '" . $this->sanitize($value) . "', ";
        }
        $set_values = rtrim($set_values, ', ');
        $query = "UPDATE $table_name SET $set_values WHERE $condition";

        if ($this->db->query($query) === TRUE) {
            return true;
        } else {
            echo "Error: " . $query . "<br>" . $this->db->error;
            return false;
        }
    }

    function delete($table_name, $condition) {
        $query = "DELETE FROM $table_name WHERE $condition";

        if ($this->db->query($query) === TRUE) {
            return true;
        } else {
            echo "Error: " . $query . "<br>" . $this->db->error;
            return false;
        }
    }
}
