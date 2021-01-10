package live.autoplanter.firebase;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

/**
 * Created by Mitch on 2016-06-04.
 */
public class Register extends AppCompatActivity {
    //Creates objects/variables
    EditText etName, etEmail, etPassword;
    String name, email, password;
    Button btnRegister;
    FirebaseAuth fAuth;
    FirebaseDatabase database;
    DatabaseReference myRef;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        //Sets up page of app
        super.onCreate(savedInstanceState);
        setContentView(R.layout.register_layout);
        //Initializes objects
        etName = (EditText) findViewById(R.id.etNewName);
        etEmail = (EditText) findViewById(R.id.etNewEmail);
        etPassword = (EditText) findViewById(R.id.etNewPassword);
        btnRegister = (Button) findViewById(R.id.btnNewRegister);
        fAuth = FirebaseAuth.getInstance();


        //This method starts when the user clicks registration
        btnRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Initializes variables
                name = etName.getText().toString();
                email = etEmail.getText().toString();
                password = etPassword.getText().toString();
                fAuth.createUserWithEmailAndPassword(email,password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if(task.isSuccessful()){
                            Toast.makeText(Register.this,"User Created",Toast.LENGTH_SHORT).show();
                            String uuid = fAuth.getCurrentUser().getUid();
                            database = FirebaseDatabase.getInstance();
                            myRef = database.getReference(uuid);
                            myRef.child("username").setValue(name);

                            Intent intent = new Intent(Register.this, mainPage.class);
                            intent.putExtra("key",uuid);
                            startActivity(intent);
                        }else{
                            Toast.makeText(Register.this, "ERROR " + task.getException().getMessage(),Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
        });


    }
}
