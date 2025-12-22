import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://cypahqvxkltelnjcofaq.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUwNWQ4MTI4LWVmODYtNDBlOC1hYWI2LTU1MGM3Y2MxZjVlNCJ9.eyJwcm9qZWN0SWQiOiJjeXBhaHF2eGtsdGVsbmpjb2ZhcSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY2MjE3NTUxLCJleHAiOjIwODE1Nzc1NTEsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.VRFwG-KPCsdkiXh0ezyM5ois__M8-lN4qEp3BoyHEWw';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };