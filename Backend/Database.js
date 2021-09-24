// Author: Amay Kataria
// Date: 09/24/2021
// File: Database.js
// Description: Helper module to handle all database related methods. This module is responsible
// to read, load, commit from the database.

var Pool = require('pg').Pool;

// ------------------ postgresql database ---------------------- // 
const connString = process.env['DATABASE_URL'];
//const connString = 'postgresql://localhost/martha?user=amaykataria&password=abc123';
console.log('Database Connection String: ' + connString); 
const pool = new Pool({
    connectionString: connString
}); 

module.exports = {    
    savePreset: function(data) {
        onWriteDatabase(data)
    },

    readPresets: function(socket) {
        onReadDatabase(socket);
    },

    deletePreset: function(name) {
        onDeletePreset(name);
    }
}

function onDeletePreset(presetName) {
    pool.query('DELETE FROM presets WHERE name=$1', [presetName], (error, result) => {
        if (error) {
            throw error; 
        }

        console.log(presetName + ' entry successfully deleted from the database.'); 
    });
}

function onWriteDatabase(data) {
    let name = data['name'];
    let config = data['data'];

    // First READ THE DATABSE if something like this exists. 
    // If it does, then update the data, else make a new commit. 
    pool.query('SELECT * FROM presets WHERE name=$1', [name], (error, result) => {
        if (error) {
            throw error; 
        }

        if (result.rows.length > 0) { // Entry already exists..
            console.log('Preset Name: ' + name); 
            console.log('Entry already exists in the database: ');

            pool.query('UPDATE presets SET config=$1 WHERE name=$2', [config, name], (error, result) => {
                if (error) {
                    throw error;
                }
        
                console.log('Success: Updated entry in the adult database.');        
            });
        } else {
            pool.query('INSERT INTO presets (name, config) VALUES ($1, $2)', [name, config], (error, result) => {
                if (error) {
                    throw error;
                }
        
                console.log('Success: ' + name + ' is new entry in the database.');
            });
        }
    }); 
}

function onReadDatabase(socket) {
    pool.query('SELECT * FROM presets', (error, result) => {
        if (error) {
            throw error; 
        }

        if (result.rows.length > 0) { // Entry already exists..
            let entries = result.rows;
            socket.emit('receivePresets', entries); 
            console.log('Presets emitted'); 
        }
    }); 
}

function onUpdateDatabase(data, socket) {
    let name = data['name'];
    let config = data['config'];
    let product = data['product'];

    console.log(data);

    if (product === 'adult') {
        pool.query('UPDATE configs SET config=$1 WHERE name=$2', [config, name], (error, result) => {
            if (error) {
                throw error;
            }
    
            console.log('Success: Updated entry in the adult database.');        
        });
    } else if (product === 'childa') {
        pool.query('UPDATE childa SET config=$1 WHERE name=$2', [config, name], (error, result) => {
            if (error) {
                throw error;
            }
    
            console.log('Success: Updated entry in the childa database.');        
        });
    } else if (product === 'childb') {
        pool.query('UPDATE childb SET config=$1 WHERE name=$2', [config, name], (error, result) => {
            if (error) {
                throw error;
            }
    
            console.log('Success: Updated entry in the childb database.');        
        });
    }

}

function onDeleteEntryFromDatabase(configName, socket) {
    pool.query('DELETE FROM configs WHERE name=$1', [configName], (error, result) => {
        if (error) {
            throw error; 
        }

        console.log('Success: Deleted entry in the database.')
    });
}

// This is a join command. It will return password and configs together. 
function onQueryUserTable(username, password, res) {
    console.log('create user');
    pool.query('SELECT users.password, configs.config FROM users, configs WHERE users.name=$1 AND configs.name=$1', [username], (error, result) => {
        if (error) {
            throw error;
        }

        let pass, configs = []; 
        if (result.rows.length > 0) {
            let user = result.rows[0];
            pass = user.password;
            configs[0] = user.config;
        }
        
        res.setHeader('Content-Type', 'application/json');
        if (password === pass) {
            pool.query('SELECT childa.config FROM childa WHERE childa.name=$1', [username], (error, result) => {
                if (error) {
                    throw error; 
                }

                // Extract config from childa. 
                let user = result.rows[0];
                configs[1] = user.config; 
                
                pool.query('SELECT childb.config FROM childb WHERE childb.name=$1', [username], (error, result) => {
                    let user = result.rows[0]; 
                    configs[2] = user.config; 

                    res.end(JSON.stringify({ result: 'user_found', configs: configs }));
                    console.log('User found.');
                }); 
            });
        } else {
            res.end(JSON.stringify({ result: 'user_not_found' }));
            console.log('User not found.');
        }
    });
}

function onCreateEntryUserTable(username, password, configs, res) {
    let sweaterConfig = configs[0];
    let childAConfig = configs[1]; 
    let childBConfig = configs[2]; 

    pool.query('SELECT * FROM users WHERE name=$1', [username], (error, result) => {
        if (error) {
            throw error; 
        }

        res.setHeader('Content-Type', 'application/json');
        if (result.rows.length > 0) {
            res.end(JSON.stringify({ result: 'user_exists'}));
            console.log('User Exists');
        } else {
            pool.query('INSERT INTO users (name, password) VALUES ($1, $2)', [username, password], (error, result) => {
                if (error) {
                    throw error;
                }

                // sweater config. 
                pool.query('INSERT INTO configs (name, config) VALUES ($1, $2)', [username, sweaterConfig], (error, result) => {
                    if (error) {
                        throw error; 
                    }

                    // childA config.
                    pool.query('INSERT INTO childa (name, config) VALUES ($1, $2)', [username, childAConfig], (error, result) => {
                        if (error) {
                            throw error;
                        }

                        // childB config.
                        pool.query('INSERT INTO childb (name, config) VALUES ($1, $2)', [username, childBConfig], (error, result) => {    
                            if (error) {
                                throw error; 
                            }    

                            // Resolve the request.
                            res.end(JSON.stringify({ result: 'new_user'}));
                            console.log('New User created.');
                        });
                    });
                });
            })
        }
    });
}