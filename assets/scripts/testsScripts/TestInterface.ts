

export interface Student {
    name: string;
    score: number;
    isActive: boolean;
}

class BallStudent {
    student1: Student = { name: "Anna", score: 90, isActive: true };


    public studentStatus(student: Student): string  {

        if (student.score >= 60 && student.isActive) {

            return "студент Студент допущен" ;
        }
        else if (student.score >= 60 && student.isActive === false) {

            return "Студент неактивен";
        }
        else {

            return "Студент отчислен";
        }
    }

    a: string = this.studentStatus(this.student1);
    

    
    

}

