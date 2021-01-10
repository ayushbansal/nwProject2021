package live.autoplanter.firebase;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;

public class MainActivity extends AppCompatActivity {
    //Creates Buttons objects
    Button btnRegister, btnLogin;
    //Creates EditText objects
    EditText etEmail,etPassword;
    //Creates Strings
    String stringEmail,stringPassword;
    //Creates a DatabaseReference object
    DatabaseReference myRef;
    //Creates a FirebaseAuth object
    FirebaseAuth fAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //Sets up page of app
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initializes objects and variables
        fAuth = FirebaseAuth.getInstance();
        btnRegister = (Button) findViewById(R.id.btnRegister);
        btnLogin = (Button) findViewById(R.id.btnLogin);
        etEmail = (EditText) findViewById(R.id.etEmail);
        etPassword = (EditText) findViewById(R.id.etPassword);

        //Logs the user into the authentication table and redirects them to the mainPage
        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                stringEmail = etEmail.getText().toString();
                stringPassword = etPassword.getText().toString();
                fAuth.signInWithEmailAndPassword(stringEmail,stringPassword).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if(task.isSuccessful()){
                            String uuid = fAuth.getUid();
                            Toast.makeText(MainActivity.this,"Logged In",Toast.LENGTH_SHORT).show();
                            Intent intent = new Intent(MainActivity.this, mainPage.class);
                            intent.putExtra("key",uuid);
                            startActivity(intent);
                        }else{
                            Toast.makeText(MainActivity.this, "ERROR " + task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });

        //Redirects the user so they can register a new account
        btnRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity.this, live.autoplanter.firebase.Register.class);
                startActivity(intent);
            }
        });
    }
}