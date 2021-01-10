package live.autoplanter.firebase;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;

public class mainPage extends AppCompatActivity{
    //Creates objects/variables
    Button btnadd,btnSub;
    EditText etItems,etAmount;
    String value, items, amount;
    FirebaseDatabase database;
    DatabaseReference myRef;
    LinearLayout linearLayout;
    ArrayList<String> arrayList;
    int i=0;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        //Sets up page of app
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_page);
        linearLayout = (LinearLayout) findViewById(R.id.layout);
        arrayList = new ArrayList<>();
        //Recieve uuid after the user has logged in or signed up
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            value = extras.getString("key");
        }
        //Initializes objects
        btnSub = (Button) findViewById(R.id.btnSub);
        btnadd = (Button) findViewById(R.id.btnadd);
        etItems = (EditText) findViewById(R.id.etItems);
        etAmount = (EditText) findViewById(R.id.etAmount);

        btnSub.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                myRef = FirebaseDatabase.getInstance().getReference(value);
                Query checkItem = myRef.orderByKey();
                checkItem.addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot snapshot) {
                        for(DataSnapshot ds : snapshot.getChildren()) {
                            String key = ds.getKey();
                            System.out.println(key);
                            arrayList.add(key + " " + ds.getValue());
                            System.out.println(ds.getValue());
                        }
                        System.out.println(arrayList.size());
                        for(i=0;i<arrayList.size();i++){
                            System.out.println(arrayList.get(i));
                            CheckBox cb = new CheckBox(getApplicationContext());
                            cb.setText(arrayList.get(i));
                            linearLayout.addView(cb);
                        }
                    }
                    @Override
                    public void onCancelled(@NonNull DatabaseError error) {
                    }
                });
            }
        });

        //Adds items to noSQL table
        btnadd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Sets variables
                amount = etAmount.getText().toString();
                items = etItems.getText().toString();
                database = FirebaseDatabase.getInstance();
                myRef = database.getReference(value);
                myRef.child(items).setValue(amount);
                CheckBox cb = new CheckBox(getApplicationContext());
                cb.setText(items + " " + amount);
                linearLayout.addView(cb);
            }
        });
    }
}
